const dislikeComentarioService = require('../services/dislikeComentario.service');
const { ok, noContent } = require('../utils/apiResponse');

class DislikeComentarioController {
  async darDislike(req, res, next) {
    try {
      const dislike = await dislikeComentarioService.darDislike(req.usuario.id, req.params.comentarioId);
      return ok(res, dislike);
    } catch (err) {
      next(err);
    }
  }

  async quitarDislike(req, res, next) {
    try {
      await dislikeComentarioService.quitarDislike(req.usuario.id, req.params.comentarioId);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DislikeComentarioController();