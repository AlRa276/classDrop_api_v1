const { Op, Sequelize, QueryTypes } = require('sequelize');
const { Archivo, Usuario, Materia, ArchivoAdjunto, Comentario, sequelize } = require('../models');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Contadores calculados con subconsultas correlacionadas, para no hacer N+1 peticiones
// desde el front. Si se conoce el usuario que pregunta (usuarioActualId), también se
// agrega si ESE usuario específico ya le dio like/dislike/guardado a cada archivo —
// sin esto, el front no puede mantener el botón resaltado después de recargar la lista.
function atributosDeArchivo(usuarioActualId) {
  const idSeguro = usuarioActualId && UUID_REGEX.test(usuarioActualId) ? usuarioActualId : null;

  const columnas = [
    [
      Sequelize.literal(`(SELECT COUNT(*) FROM likes_archivos WHERE likes_archivos.archivo_id = "Archivo"."id")`),
      'totalLikes',
    ],
    [
      Sequelize.literal(`(SELECT COUNT(*) FROM dislikes_archivos WHERE dislikes_archivos.archivo_id = "Archivo"."id")`),
      'totalDislikes',
    ],
    [
      Sequelize.literal(`(SELECT COUNT(*) FROM descargas_archivos WHERE descargas_archivos.archivo_id = "Archivo"."id")`),
      'totalDescargas',
    ],
    [
      Sequelize.literal(`(SELECT COUNT(*) FROM comentarios WHERE comentarios.archivo_id = "Archivo"."id" AND comentarios.eliminado = false)`),
      'totalComentarios',
    ],
  ];

  if (idSeguro) {
    columnas.push(
      [
        Sequelize.literal(`EXISTS(SELECT 1 FROM likes_archivos WHERE likes_archivos.archivo_id = "Archivo"."id" AND likes_archivos.usuario_id = '${idSeguro}')`),
        'isLikedByMe',
      ],
      [
        Sequelize.literal(`EXISTS(SELECT 1 FROM dislikes_archivos WHERE dislikes_archivos.archivo_id = "Archivo"."id" AND dislikes_archivos.usuario_id = '${idSeguro}')`),
        'isDislikedByMe',
      ],
      [
        Sequelize.literal(`EXISTS(SELECT 1 FROM guardados_archivos WHERE guardados_archivos.archivo_id = "Archivo"."id" AND guardados_archivos.usuario_id = '${idSeguro}')`),
        'isGuardadoByMe',
      ]
    );
  }

  return { include: columnas };
}

// Igual que arriba, pero además trae el nivel de riesgo (FUNCIÓN 2: fn_nivel_riesgo_archivo),
// solo para la cola de moderación, donde sí tiene sentido mostrarlo.
function atributosDeModeracion(usuarioActualId) {
  const base = atributosDeArchivo(usuarioActualId);
  return {
    include: [
      ...base.include,
      [Sequelize.literal(`fn_nivel_riesgo_archivo("Archivo"."id")`), 'nivelRiesgo'],
    ],
  };
}

class ArchivoRepository {
  async crear(datos) {
    return await Archivo.create(datos);
  }

  async buscarPorId(id, usuarioActualId) {
    return await Archivo.findByPk(id, {
      attributes: atributosDeArchivo(usuarioActualId),
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
      ],
    });
  }

  async listarPublicados({ materiaId, search, orden = 'recientes', limite = 20, offset = 0, usuarioActualId } = {}) {
    const where = { estado: 'publicado' };
    if (materiaId) where.materiaId = materiaId;
    if (search) where.titulo = { [Op.iLike]: `%${search}%` };

    if (orden === 'populares') {
      return await this._listarPorPopularidad({ materiaId, search, limite, offset, usuarioActualId });
    }

    const direccion = orden === 'antiguos' ? 'ASC' : 'DESC';

    return await Archivo.findAndCountAll({
      where,
      attributes: atributosDeArchivo(usuarioActualId),
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
      ],
      limit: limite,
      offset,
      order: [['creado_en', direccion]],
      subQuery: false,
    });
  }

  // Orden por relevancia real: VISTA 1 (v_archivos_reporte, INNER JOIN archivo-autor-materia)
  // + FUNCIÓN 1 (fn_popularidad_archivo) calculan el orden en SQL; luego traemos esos mismos
  // archivos con Sequelize (para mantener el mismo formato de respuesta que el resto del API)
  // y los reordenamos según ese cálculo.
  async _listarPorPopularidad({ materiaId, search, limite, offset, usuarioActualId }) {
    let filtros = '';
    const reemplazos = { limite, offset };

    if (materiaId) {
      filtros += ' AND materia_id = :materiaId';
      reemplazos.materiaId = materiaId;
    }
    if (search) {
      filtros += ' AND titulo ILIKE :search';
      reemplazos.search = `%${search}%`;
    }

    const filas = await sequelize.query(
      `SELECT id, fn_popularidad_archivo(id) AS popularidad
       FROM v_archivos_reporte
       WHERE 1 = 1 ${filtros}
       ORDER BY popularidad DESC, creado_en DESC
       LIMIT :limite OFFSET :offset`,
      { replacements: reemplazos, type: QueryTypes.SELECT }
    );

    const ids = filas.map((f) => f.id);
    if (ids.length === 0) return { count: 0, rows: [] };

    const whereConteo = { estado: 'publicado' };
    if (materiaId) whereConteo.materiaId = materiaId;
    if (search) whereConteo.titulo = { [Op.iLike]: `%${search}%` };
    const count = await Archivo.count({ where: whereConteo });

    const archivos = await Archivo.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: atributosDeArchivo(usuarioActualId),
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
      ],
    });

    const porId = new Map(archivos.map((a) => [a.id, a]));
    const rows = ids.map((id) => porId.get(id)).filter(Boolean);

    return { count, rows };
  }

  async listarPorUsuario(usuarioId, { estado, limite = 20, offset = 0, usuarioActualId } = {}) {
    const where = { subidoPor: usuarioId };
    if (estado) where.estado = estado;

    return await Archivo.findAndCountAll({
      where,
      attributes: atributosDeArchivo(usuarioActualId ?? usuarioId),
      include: [
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
        { model: Usuario, as: 'autor' }, 
      ],
      limit: limite,
      offset,
      order: [['creado_en', 'DESC']],
      subQuery: false,
    });
  }

  // Cola de moderación: todo lo que un admin todavía tiene que revisar.
  // Incluye nivelRiesgo (FUNCIÓN 2) para priorizar qué revisar primero.
  async listarPendientes({ limite = 50, offset = 0, usuarioActualId } = {}) {
    return await Archivo.findAndCountAll({
      where: { estado: { [Op.in]: ['pendiente', 'escaneando', 'revision_calidad'] } },
      attributes: atributosDeModeracion(usuarioActualId),
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
      ],
      limit: limite,
      offset,
      order: [['creado_en', 'ASC']], // los más antiguos primero, como una cola normal
      subQuery: false,
    });
  }

  // Usa los PROCEDIMIENTOS ALMACENADOS sp_publicar_archivo / sp_rechazar_archivo para
  // los 2 cambios de estado que representan una decisión real de moderación. El resto
  // de transiciones (ej. volver a 'pendiente') se manejan como update normal.
  async actualizarEstado(id, estado, motivoRechazo = null) {
    const archivo = await Archivo.findByPk(id);
    if (!archivo) return null;

    if (estado === 'publicado') {
      await sequelize.query('CALL sp_publicar_archivo(:id)', { replacements: { id } });
    } else if (estado === 'rechazado') {
      await sequelize.query('CALL sp_rechazar_archivo(:id, :motivo)', {
        replacements: { id, motivo: motivoRechazo?.trim() || 'Sin motivo especificado' },
      });
    } else {
      await archivo.update({ estado, publicadoEn: null, motivoRechazo: null });
    }

    return await Archivo.findByPk(id);
  }

  async guardarResultadoIa(id, { puntajeRiesgo, nivelesEjecutados }) {
    return await Archivo.update(
      { riesgoIa: puntajeRiesgo, resultadoIa: nivelesEjecutados },
      { where: { id } }
    );
  }

  // Hidrata una lista de ids de archivo con el mismo formato completo que usa el resto
  // del API (autor, materia, adjuntos, contadores, y mi propio like/dislike/guardado).
  // Se usa en "mis descargas" y "mis favoritos" del perfil, para no duplicar esta lógica.
  async obtenerVariosPorId(ids, usuarioActualId) {
    if (!ids || ids.length === 0) return [];

    const archivos = await Archivo.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: atributosDeArchivo(usuarioActualId),
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
      ],
    });

    const porId = new Map(archivos.map((a) => [a.id, a]));
    return ids.map((id) => porId.get(id)).filter(Boolean); // conserva el orden original (más reciente primero)
  }

  async ocultarPorDislikes(id) {
    const archivo = await Archivo.findByPk(id);
    if (!archivo) return null;
    return await archivo.update({ estado: 'oculto_dislikes' });
  }

  // El admin descarta el reporte: el archivo no tenía ningún problema real,
  // así que vuelve a estar publicado y visible para los estudiantes.
  async restaurarPublicado(id) {
    const archivo = await Archivo.findByPk(id);
    if (!archivo) return null;
    return await archivo.update({ estado: 'publicado' });
  }


  async eliminar(id) {
    const archivo = await Archivo.findByPk(id);
    if (!archivo) return null;
    await archivo.destroy(); // el ON DELETE CASCADE se encarga de comentarios/likes
    return true;
  }

  async contarPorUsuario(usuarioId, estado) {
    return await Archivo.count({ where: { subidoPor: usuarioId, estado } });
  }
}

module.exports = new ArchivoRepository();