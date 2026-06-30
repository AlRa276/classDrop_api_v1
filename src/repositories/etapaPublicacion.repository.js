const { EtapaPublicacion } = require('../models');

class EtapaPublicacionRepository {
  async crearEtapasIniciales(archivoId, etapas) {
    const registros = etapas.map(({ valor, orden }) => ({
      archivoId, etapa: valor, orden, completado: false, progreso: null,
    }));
    return await EtapaPublicacion.bulkCreate(registros);
  }

  async listarPorArchivo(archivoId) {
    return await EtapaPublicacion.findAll({
      where: { archivoId },
      order: [['orden', 'ASC']],
    });
  }

  async buscarEtapa(archivoId, etapa) {
    return await EtapaPublicacion.findOne({ where: { archivoId, etapa } });
  }

  async actualizarEtapa(archivoId, etapa, datos) {
    const registro = await this.buscarEtapa(archivoId, etapa);
    if (!registro) return null;
    return await registro.update({ ...datos, actualizadoEn: new Date() });
  }
}

module.exports = new EtapaPublicacionRepository();