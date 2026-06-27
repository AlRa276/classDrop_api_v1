const { Archivo, Usuario, Materia, ArchivoAdjunto, Comentario } = require('../models');

class ArchivoRepository {
  async crear(datos) {
    return await Archivo.create(datos);
  }

  async buscarPorId(id) {
    return await Archivo.findByPk(id, {
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
        { model: ArchivoAdjunto, as: 'adjuntos' },
      ],
    });
  }

  async listarPublicados({ materiaId, limite = 20, offset = 0 } = {}) {
    const where = { estado: 'publicado' };
    if (materiaId) where.materiaId = materiaId;

    return await Archivo.findAndCountAll({
      where,
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
        { model: Materia, as: 'materia' },
      ],
      limit: limite,
      offset,
      order: [['publicadoEn', 'DESC']],
    });
  }

  async listarPorUsuario(usuarioId) {
    return await Archivo.findAll({ where: { subidoPor: usuarioId } });
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