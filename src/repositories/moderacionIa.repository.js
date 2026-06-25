const { ModeracionIa } = require('../models');

class ModeracionIaRepository {
  async crear(datos) {
    return await ModeracionIa.create(datos);
  }

  async listarPorArchivo(archivoId) {
    return await ModeracionIa.findAll({ where: { archivoId } });
  }
}

module.exports = new ModeracionIaRepository();