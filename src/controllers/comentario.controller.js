const comentarioService = require('../services/comentario.service');
const { ok, created, noContent } = require('../utils/apiResponse');

class ComentarioController {
  async listarPorArchivo(req, res, next) {
    try {
      const comentarios = await comentarioService.listarPorArchivo(req.params.id, req.usuario?.id);
      return ok(res, comentarios);
    } catch (err) {
      next(err);
    }
  }

  async crear(req, res, next) {
    try {
      const comentario = await comentarioService.crearComentario({
        usuarioId: req.usuario.id,
        archivoId: req.body.archivoId,
        contenido: req.body.contenido,
      });
      return created(res, comentario);
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req, res, next) {
    try {
      await comentarioService.eliminarComentario(req.usuario.id, req.params.id);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ComentarioController();