const dislikeArchivoRepository = require('../repositories/dislikeArchivo.repository');
const likeArchivoRepository = require('../repositories/likeArchivo.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');
const reporteRepository = require('../repositories/reporte.repository');
const analyticsService = require('./analytics.service');

// Al llegar a este número de dislikes, el archivo se oculta automáticamente
// de los estudiantes y pasa a la cola de reportes para que un admin decida.
const UMBRAL_DISLIKES_ARCHIVO = 5;

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

    const dislike = await dislikeArchivoRepository.crear(usuarioId, archivoId);

    analyticsService.registrarEvento({
      usuarioId,
      nombreEvento: 'dislike_archivo',
      params: { archivo_id: archivoId },
    });

    // El archivo llega al umbral: se oculta y se manda a revisión de admin.
    // Arriba ya validamos que archivo.estado === 'publicado', así que esto
    // solo puede disparar UNA vez por archivo (una vez oculto, ya no vuelve
    // a pasar por esta validación hasta que un admin lo restaure).
    const totalDislikes = await dislikeArchivoRepository.contarPorArchivo(archivoId);
    if (totalDislikes >= UMBRAL_DISLIKES_ARCHIVO) {
      await archivoRepository.ocultarPorDislikes(archivoId);
      await reporteRepository.crear({
        reportadoPor: null, // reporte automático del sistema, sin un usuario específico
        tipoContenido: 'archivo',
        archivoId,
      });
    }

    return dislike;
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