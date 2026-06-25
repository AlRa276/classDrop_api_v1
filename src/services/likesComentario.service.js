const likesComentarioRepository = require('../repositories/likesComentario.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const comentarioRepository = require('../repositories/comentario.repository');

class LikesComentarioService {
  async darLike(usuarioId, comentarioId) {
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

    const existe = await likesComentarioRepository.existe(usuarioId, comentarioId);
    if (existe) {
      const error = new Error('Ya has dado like a este comentario');
      error.status = 409;
      throw error;
    }

    return await likesComentarioRepository.crear(usuarioId, comentarioId);
  }

  async quitarLike(usuarioId, comentarioId) {
    const existe = await likesComentarioRepository.existe(usuarioId, comentarioId);
    if (!existe) {
      const error = new Error('No existe like para eliminar');
      error.status = 404;
      throw error;
    }

    await likesComentarioRepository.eliminar(usuarioId, comentarioId);
    return true;
  }

  async contarLikes(comentarioId) {
    return await likesComentarioRepository.contarPorComentario(comentarioId);
  }
}

module.exports = new LikesComentarioService();