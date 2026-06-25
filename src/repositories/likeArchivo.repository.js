const { LikeArchivo } = require('../models');

class LikeArchivoRepository {
  async existe(usuarioId, archivoId) {
    return await LikeArchivo.findOne({ where: { usuarioId, archivoId } });
  }

  async crear(usuarioId, archivoId) {
    return await LikeArchivo.create({ usuarioId, archivoId });
  }

  async eliminar(usuarioId, archivoId) {
    return await LikeArchivo.destroy({ where: { usuarioId, archivoId } });
  }

  async contarPorArchivo(archivoId) {
    return await LikeArchivo.count({ where: { archivoId } });
  }
}

module.exports = new LikeArchivoRepository();