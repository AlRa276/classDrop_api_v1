const { ModeracionIA } = require('../models');

class ModeracionIaRepository {
  async crear(datos) {
    return await ModeracionIA.create(datos);
  }

  async listarPorArchivo(archivoId) {
    return await ModeracionIA.findAll({ where: { archivoId } });
  }
}

module.exports = new ModeracionIaRepository();