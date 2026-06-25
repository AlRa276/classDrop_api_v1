const { ArchivoAdjunto } = require('../models');

class ArchivoAdjuntoRepository {
  async crear(datos) {
    return await ArchivoAdjunto.create(datos);
  }

  async crearMultiples(listaDatos) {
    return await ArchivoAdjunto.bulkCreate(listaDatos);
  }

  async listarPorArchivo(archivoId) {
    return await ArchivoAdjunto.findAll({
      where: { archivoId },
      order: [['orden', 'ASC']],
    });
  }

  async eliminar(id) {
    const adjunto = await ArchivoAdjunto.findByPk(id);
    if (!adjunto) return null;
    await adjunto.destroy();
    return true;
  }
}

module.exports = new ArchivoAdjuntoRepository();