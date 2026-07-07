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

  // Se usa cuando el admin restaura un archivo (reporte descartado): le da un
  // "borrón y cuenta nueva" para que no se vuelva a ocultar solo de inmediato.
  async eliminarTodosPorArchivo(archivoId) {
    return await DislikesArchivo.destroy({ where: { archivoId } });
  }
}

module.exports = new DislikeArchivoRepository();