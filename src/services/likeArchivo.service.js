const likeArchivoRepository = require('../repositories/likeArchivo.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');

class LikeArchivoService {
  async darLike(usuarioId, archivoId) {
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

    const existe = await likeArchivoRepository.existe(usuarioId, archivoId);
    if (existe) {
      const error = new Error('Ya has dado like a este archivo');
      error.status = 409;
      throw error;
    }

    return await likeArchivoRepository.crear(usuarioId, archivoId);
  }

  async quitarLike(usuarioId, archivoId) {
    const existe = await likeArchivoRepository.existe(usuarioId, archivoId);
    if (!existe) {
      const error = new Error('No existe like para eliminar');
      error.status = 404;
      throw error;
    }

    await likeArchivoRepository.eliminar(usuarioId, archivoId);
    return true;
  }

  async contarLikes(archivoId) {
    return await likeArchivoRepository.contarPorArchivo(archivoId);
  }
}

module.exports = new LikeArchivoService();