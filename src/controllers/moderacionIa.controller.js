const moderacionIaService = require('../services/moderacionIa.service');
const { ok, created } = require('../utils/apiResponse');

class ModeracionIaController {
  async registrar(req, res, next) {
    try {
      const moderacion = await moderacionIaService.registrarModeracion({
        archivoId: req.body.archivoId,
        motivoFlag: req.body.motivoFlag,
        aprobado: req.body.aprobado,
        revisadoPor: req.usuario.id,
      });
      return created(res, moderacion);
    } catch (err) {
      next(err);
    }
  }

  async listarPorArchivo(req, res, next) {
    try {
      const moderaciones = await moderacionIaService.listarPorArchivo(req.params.archivoId);
      return ok(res, moderaciones);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ModeracionIaController();