const likeArchivoRepository = require('../repositories/likeArchivo.repository');
const dislikeArchivoRepository = require('../repositories/dislikeArchivo.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');
const analyticsService = require('./analytics.service');

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

    // Un like quita el dislike existente, si lo hay (mutuamente excluyentes)
    const yaLeDisgustaba = await dislikeArchivoRepository.existe(usuarioId, archivoId);
    if (yaLeDisgustaba) {
      await dislikeArchivoRepository.eliminar(usuarioId, archivoId);
    }

    const nuevoLike = await likeArchivoRepository.crear(usuarioId, archivoId);

    analyticsService.registrarEvento({
      usuarioId,
      nombreEvento: 'like_archivo',
      params: { archivo_id: archivoId },
    });

    return nuevoLike;
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