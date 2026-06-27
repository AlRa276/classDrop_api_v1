const { LikesArchivo } = require('../models');

class LikeArchivoRepository {
  async existe(usuarioId, archivoId) {
    return await LikesArchivo.findOne({ where: { usuarioId, archivoId } });
  }

  async crear(usuarioId, archivoId) {
    return await LikesArchivo.create({ usuarioId, archivoId });
  }

  async eliminar(usuarioId, archivoId) {
    return await LikesArchivo.destroy({ where: { usuarioId, archivoId } });
  }

  async contarPorArchivo(archivoId) {
    return await LikesArchivo.count({ where: { archivoId } });
  }
}

module.exports = new LikeArchivoRepository();