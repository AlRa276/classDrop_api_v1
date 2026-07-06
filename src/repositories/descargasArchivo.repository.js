const { DescargasArchivo, Archivo, Usuario, sequelize } = require('../models');
const { Sequelize } = require('sequelize');

class DescargasArchivoRepository {
  async registrarDescarga(usuarioId, archivoId, adjuntoId = null) {
    return await DescargasArchivo.create({
      usuarioId,
      archivoId,
      adjuntoId
    });
  }

  // Ids de archivo distintos que este usuario ha descargado, ordenados por la
  // descarga más reciente. Un usuario puede descargar el mismo archivo varias
  // veces; aquí solo nos interesa "qué archivos", no cada descarga individual.
  async idsArchivosDescargados(usuarioId) {
    const filas = await DescargasArchivo.findAll({
      where: { usuarioId },
      attributes: [
        'archivoId',
        [Sequelize.fn('MAX', Sequelize.col('descargado_en')), 'ultimaDescarga'],
      ],
      group: ['archivoId'],
      order: [[Sequelize.literal('"ultimaDescarga"'), 'DESC']],
    });
    return filas.map((f) => f.archivoId);
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