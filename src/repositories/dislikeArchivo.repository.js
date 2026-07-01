const { DislikesArchivo } = require('../models');

class DislikeArchivoRepository {
  async existe(usuarioId, archivoId) {
    return await DislikesArchivo.findOne({ where: { usuarioId, archivoId } });
  }

  async crear(usuarioId, archivoId) {
    return await DislikesArchivo.create({ usuarioId, archivoId });
  }

  async eliminar(usuarioId, archivoId) {
    return await DislikesArchivo.destroy({ where: { usuarioId, archivoId } });
  }

  async contarPorArchivo(archivoId) {
    return await DislikesArchivo.count({ where: { archivoId } });
  }
}

module.exports = new DislikeArchivoRepository();