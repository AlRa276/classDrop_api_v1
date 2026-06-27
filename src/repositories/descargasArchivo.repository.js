const { DescargasArchivo, Archivo, Usuario } = require('../models');

class DescargasArchivoRepository {
  async registrarDescarga(usuarioId, archivoId, adjuntoId = null) {
    return await DescargasArchivo.create({
      usuarioId,
      archivoId,
      adjuntoId
    });
  }

  async obtenerPorId(id) {
    return await DescargasArchivo.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombreCompleto', 'correo'] },
        { model: Archivo, attributes: ['id', 'titulo'] }
      ]
    });
  }

  async listarPorArchivo(archivoId) {
    return await DescargasArchivo.findAll({
      where: { archivoId },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombreCompleto'] }
      ],
      order: [['descargado_en', 'DESC']]
    });
  }

  async listarPorUsuario(usuarioId) {
    return await DescargasArchivo.findAll({
      where: { usuarioId },
      include: [
        { model: Archivo, as: 'archivo', attributes: ['id', 'titulo'] }
      ],
      order: [['descargado_en', 'DESC']]
    });
  }

  async contarPorArchivo(archivoId) {
    return await DescargasArchivo.count({ where: { archivoId } });
  }

  async contarPorUsuario(usuarioId) {
    return await DescargasArchivo.count({ where: { usuarioId } });
  }
}

module.exports = new DescargasArchivoRepository();
