const dislikeArchivoRepository = require('../repositories/dislikeArchivo.repository');
const likeArchivoRepository = require('../repositories/likeArchivo.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');

class DislikeArchivoService {
  async darDislike(usuarioId, archivoId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const archivo = await archivoRepository.buscarPorId(archivoId);
    if (!archivo || archivo.estado !== 'publicado') {
      const error = new Error('Archivo no disponible para reaccionar');
      error.status = 400;
      throw error;
    }

    const existe = await dislikeArchivoRepository.existe(usuarioId, archivoId);
    if (existe) {
      const error = new Error('Ya has dado dislike a este archivo');
      error.status = 409;
      throw error;
    }

    // Un dislike quita el like existente, si lo hay (mutuamente excluyentes)
    const yaLeGustaba = await likeArchivoRepository.existe(usuarioId, archivoId);
    if (yaLeGustaba) {
      await likeArchivoRepository.eliminar(usuarioId, archivoId);
    }

    return await dislikeArchivoRepository.crear(usuarioId, archivoId);
  }

  async quitarDislike(usuarioId, archivoId) {
    const existe = await dislikeArchivoRepository.existe(usuarioId, archivoId);
    if (!existe) {
      const error = new Error('No existe dislike para eliminar');
      error.status = 404;
      throw error;
    }

    await dislikeArchivoRepository.eliminar(usuarioId, archivoId);
    return true;
  }

  async contarDislikes(archivoId) {
    return await dislikeArchivoRepository.contarPorArchivo(archivoId);
  }
}

module.exports = new DislikeArchivoService();