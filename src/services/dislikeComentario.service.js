const dislikeComentarioRepository = require('../repositories/dislikeComentario.repository');
const likesComentarioRepository = require('../repositories/likesComentario.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const comentarioRepository = require('../repositories/comentario.repository');
const reporteRepository = require('../repositories/reporte.repository');
const analyticsService = require('./analytics.service');

// Al llegar a este número de dislikes, el comentario se oculta automáticamente
// y pasa a la cola de reportes para que un admin decida.
const UMBRAL_DISLIKES_COMENTARIO = 5;

class DislikeComentarioService {
  async darDislike(usuarioId, comentarioId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const comentario = await comentarioRepository.buscarPorId(comentarioId);
    if (!comentario || comentario.eliminado || comentario.oculto) {
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

    const dislike = await dislikeComentarioRepository.crear(usuarioId, comentarioId);

    analyticsService.registrarEvento({
      usuarioId,
      nombreEvento: 'dislike_comentario',
      params: { comentario_id: comentarioId },
    });

    // El comentario llega al umbral: se oculta y se manda a revisión de admin.
    // Arriba ya validamos "!comentario.oculto", así que esto solo dispara
    // UNA vez por comentario.
    const totalDislikes = await dislikeComentarioRepository.contarPorComentario(comentarioId);
    if (totalDislikes >= UMBRAL_DISLIKES_COMENTARIO) {
      await comentarioRepository.marcarOculto(comentarioId);
      await reporteRepository.crear({
        reportadoPor: null, // reporte automático del sistema, sin un usuario específico
        tipoContenido: 'comentario',
        comentarioId,
      });
    }

    return dislike;
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