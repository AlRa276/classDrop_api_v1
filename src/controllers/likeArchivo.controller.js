const likeArchivoService = require('../services/likeArchivo.service');
const { ok, noContent } = require('../utils/apiResponse');

class LikeArchivoController {
  async darLike(req, res, next) {
    try {
      const like = await likeArchivoService.darLike(req.usuario.id, req.params.archivoId);
      return ok(res, like);
    } catch (err) {
      next(err);
    }
  }

  async quitarLike(req, res, next) {
    try {
      await likeArchivoService.quitarLike(req.usuario.id, req.params.archivoId);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LikeArchivoController();