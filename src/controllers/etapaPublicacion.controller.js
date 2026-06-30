const etapaPublicacionService = require('../services/etapaPublicacion.service');
const { ok } = require('../utils/apiResponse');

class EtapaPublicacionController {
  async obtenerPorArchivo(req, res, next) {
    try {
      return ok(res, await etapaPublicacionService.obtenerPorArchivo(req.params.archivoId, req.usuario));
    } catch (err) { next(err); }
  }
  async avanzarEtapa(req, res, next) {
    try {
      const { archivoId, etapa } = req.params;
      return ok(res, await etapaPublicacionService.avanzarEtapa(archivoId, etapa, req.body));
    } catch (err) { next(err); }
  }
}

module.exports = new EtapaPublicacionController();