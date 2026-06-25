const likesComentarioService = require('../services/likesComentario.service');
const { ok, noContent } = require('../utils/apiResponse');

class LikesComentarioController {
  async darLike(req, res, next) {
    try {
      const like = await likesComentarioService.darLike(req.usuario.id, req.params.comentarioId);
      return ok(res, like);
    } catch (err) {
      next(err);
    }
  }

  async quitarLike(req, res, next) {
    try {
      await likesComentarioService.quitarLike(req.usuario.id, req.params.comentarioId);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LikesComentarioController();