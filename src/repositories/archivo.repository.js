const { Op, Sequelize } = require('sequelize');
const { Archivo, Usuario, Materia, ArchivoAdjunto, Comentario } = require('../models');

// Contadores calculados con subconsultas correlacionadas, para no hacer N+1 peticiones
// desde el front. Se agregan como columnas extra junto a los atributos normales de Archivo.
const ATRIBUTOS_CON_CONTADORES = {
  include: [
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
  ],
};

class ArchivoRepository {
  async crear(datos) {
    return await Archivo.create(datos);
  }

  async buscarPorId(id) {
    return await Archivo.findByPk(id, {
      attributes: ATRIBUTOS_CON_CONTADORES,
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
      ],
    });
  }

  async listarPublicados({ materiaId, search, orden = 'recientes', limite = 20, offset = 0 } = {}) {
    const where = { estado: 'publicado' };
    if (materiaId) where.materiaId = materiaId;
    if (search) where.titulo = { [Op.iLike]: `%${search}%` };

    const direccion = orden === 'antiguos' ? 'ASC' : 'DESC';

    return await Archivo.findAndCountAll({
      where,
      attributes: ATRIBUTOS_CON_CONTADORES,
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
      ],
      limit: limite,
      offset,
      order: [['creado_en', direccion]],
      subQuery: false,
    });
  }

  async listarPorUsuario(usuarioId, { estado, limite = 20, offset = 0 } = {}) {
    const where = { subidoPor: usuarioId };
    if (estado) where.estado = estado;

    return await Archivo.findAndCountAll({
      where,
      attributes: ATRIBUTOS_CON_CONTADORES,
      include: [{ model: Materia, as: 'materia' }],
      limit: limite,
      offset,
      order: [['creado_en', 'DESC']],
      subQuery: false,
    });
  }

  async actualizarEstado(id, estado, motivoRechazo = null) {
    const archivo = await Archivo.findByPk(id);
    if (!archivo) return null;

    const datos = { estado };

    if (estado === 'publicado') {
      datos.publicadoEn = new Date();
      datos.motivoRechazo = null;
    } else {
      datos.publicadoEn = null;
      if (estado === 'rechazado') {
        datos.motivoRechazo = motivoRechazo?.trim() || null;
      } else {
        datos.motivoRechazo = null;
      }
    }

    return await archivo.update(datos);
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