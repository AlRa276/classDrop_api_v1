const dislikeComentarioRepository = require('../repositories/dislikeComentario.repository');
const likesComentarioRepository = require('../repositories/likesComentario.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const comentarioRepository = require('../repositories/comentario.repository');

class DislikeComentarioService {
  async darDislike(usuarioId, comentarioId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const comentario = await comentarioRepository.buscarPorId(comentarioId);
    if (!comentario || comentario.eliminado) {
      const error = new Error('Comentario no disponible para reaccionar');
      error.status = 400;
      throw error;
    }

    const existe = await dislikeComentarioRepository.existe(usuarioId, comentarioId);
    if (existe) {
      const error = new Error('Ya has dado dislike a este comentario');
      error.status = 409;
      throw error;
    }

    // Un dislike quita el like existente, si lo hay (mutuamente excluyentes)
    const yaLeGustaba = await likesComentarioRepository.existe(usuarioId, comentarioId);
    if (yaLeGustaba) {
      await likesComentarioRepository.eliminar(usuarioId, comentarioId);
    }

    return await dislikeComentarioRepository.crear(usuarioId, comentarioId);
  }

  async quitarDislike(usuarioId, comentarioId) {
    const existe = await dislikeComentarioRepository.existe(usuarioId, comentarioId);
    if (!existe) {
      const error = new Error('No existe dislike para eliminar');
      error.status = 404;
      throw error;
    }

    await dislikeComentarioRepository.eliminar(usuarioId, comentarioId);
    return true;
  }

  async contarDislikes(comentarioId) {
    return await dislikeComentarioRepository.contarPorComentario(comentarioId);
  }
}

module.exports = new DislikeComentarioService();