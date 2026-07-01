const dislikeArchivoService = require('../services/dislikeArchivo.service');
const { ok, noContent } = require('../utils/apiResponse');

class DislikeArchivoController {
  async darDislike(req, res, next) {
    try {
      const dislike = await dislikeArchivoService.darDislike(req.usuario.id, req.params.archivoId);
      return ok(res, dislike);
    } catch (err) {
      next(err);
    }
  }

  async quitarDislike(req, res, next) {
    try {
      await dislikeArchivoService.quitarDislike(req.usuario.id, req.params.archivoId);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DislikeArchivoController();