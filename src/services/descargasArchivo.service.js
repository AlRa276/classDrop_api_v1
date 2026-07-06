const descargasArchivoRepository = require('../repositories/descargasArchivo.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');

class DescargasArchivoService {
  async registrarDescarga(usuarioId, archivoId, adjuntoId = null) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const archivo = await archivoRepository.buscarPorId(archivoId);
    if (!archivo || archivo.estado !== 'publicado') {
      const error = new Error('Archivo no disponible para descarga');
      error.status = 400;
      throw error;
    }

    return await descargasArchivoRepository.registrarDescarga(usuarioId, archivoId, adjuntoId);
  }

  // Para la sección "Descargas" del perfil: devuelve los archivos completos
  // (con autor, materia, contadores, mi like/dislike/guardado), no el log crudo.
  async listarArchivosDescargados(usuarioId) {
    const ids = await descargasArchivoRepository.idsArchivosDescargados(usuarioId);
    return await archivoRepository.obtenerVariosPorId(ids, usuarioId);
  }

  async listarPorUsuario(usuarioId) {
    return await descargasArchivoRepository.listarPorUsuario(usuarioId);
  }

  async listarPorArchivo(archivoId) {
    return await descargasArchivoRepository.listarPorArchivo(archivoId);
  }

  async contarPorArchivo(archivoId) {
    return await descargasArchivoRepository.contarPorArchivo(archivoId);
  }

  async contarPorUsuario(usuarioId) {
    return await descargasArchivoRepository.contarPorUsuario(usuarioId);
  }
}

module.exports = new DescargasArchivoService();