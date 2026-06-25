const descargasArchivoService = require('../services/descargasArchivo.service');
const { ok, created } = require('../utils/apiResponse');

class DescargasArchivoController {
  async registrar(req, res, next) {
    try {
      const descarga = await descargasArchivoService.registrarDescarga(
        req.usuario.id,
        req.body.archivoId,
        req.body.adjuntoId
      );
      return created(res, descarga);
    } catch (err) {
      next(err);
    }
  }

  async listarPorUsuario(req, res, next) {
    try {
      const descargas = await descargasArchivoService.listarPorUsuario(req.usuario.id);
      return ok(res, descargas);
    } catch (err) {
      next(err);
    }
  }

  async listarPorArchivo(req, res, next) {
    try {
      const descargas = await descargasArchivoService.listarPorArchivo(req.params.archivoId);
      return ok(res, descargas);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DescargasArchivoController();