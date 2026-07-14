const guardadosArchivoRepository = require('../repositories/guardadosArchivo.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');
const analyticsService = require('./analytics.service');

class GuardadosArchivoService {
  async guardarArchivo(usuarioId, archivoId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const archivo = await archivoRepository.buscarPorId(archivoId);
    if (!archivo || archivo.estado !== 'publicado') {
      const error = new Error('Archivo no disponible para guardar');
      error.status = 400;
      throw error;
    }

    const existe = await guardadosArchivoRepository.existe(usuarioId, archivoId);
    if (existe) {
      const error = new Error('Archivo ya guardado');
      error.status = 409;
      throw error;
    }

    const guardado = await guardadosArchivoRepository.crear(usuarioId, archivoId);

    analyticsService.registrarEvento({
      usuarioId,
      nombreEvento: 'guardar_archivo',
      params: { archivo_id: archivoId },
    });

    return guardado;
  }

  async quitarGuardado(usuarioId, archivoId) {
    const existe = await guardadosArchivoRepository.existe(usuarioId, archivoId);
    if (!existe) {
      const error = new Error('Guardado no encontrado');
      error.status = 404;
      throw error;
    }

    await guardadosArchivoRepository.eliminar(usuarioId, archivoId);
    return true;
  }

  async listarPorUsuario(usuarioId, limit = 50, offset = 0) {
    return await guardadosArchivoRepository.listarPorUsuario(usuarioId, limit, offset);
  }

  // Para la sección "Favoritos" del perfil: archivos completos, mismo formato
  // que el resto del feed (autor, materia, contadores, mi like/dislike/guardado).
  async listarArchivosGuardados(usuarioId) {
    const ids = await guardadosArchivoRepository.idsArchivosGuardados(usuarioId);
    return await archivoRepository.obtenerVariosPorId(ids, usuarioId);
  }

  async contarPorUsuario(usuarioId) {
    return await guardadosArchivoRepository.contarPorUsuario(usuarioId);
  }
}

module.exports = new GuardadosArchivoService();