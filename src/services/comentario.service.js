const comentarioRepository = require('../repositories/comentario.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');

const PALABRAS_PROHIBIDAS = ['vulgaridad1', 'vulgaridad2', 'spam'];
const PATRON_SPAM = /(http:\/\/|https:\/\/|www\.)/i;

class ComentarioService {
  async crearComentario({ usuarioId, archivoId, contenido }) {
    if (!contenido || !usuarioId || !archivoId) {
      const error = new Error('Faltan datos para crear el comentario');
      error.status = 400;
      throw error;
    }

    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const archivo = await archivoRepository.buscarPorId(archivoId);
    if (!archivo || archivo.estado !== 'publicado') {
      const error = new Error('No se puede comentar un archivo no publicado');
      error.status = 400;
      throw error;
    }

    const tieneSpam = PATRON_SPAM.test(contenido);
    const tieneProhibida = PALABRAS_PROHIBIDAS.some((palabra) =>
      contenido.toLowerCase().includes(palabra)
    );

    if (tieneSpam || tieneProhibida) {
      const error = new Error('El comentario contiene contenido prohibido o spam');
      error.status = 422;
      throw error;
    }

    return await comentarioRepository.crear({ usuarioId, archivoId, contenido });
  }

  async listarPorArchivo(archivoId, usuarioId) {
    return await comentarioRepository.listarPorArchivo(archivoId, usuarioId);
  }

  async eliminarComentario(usuarioId, comentarioId) {
    const comentario = await comentarioRepository.buscarPorId(comentarioId);
    if (!comentario) {
      const error = new Error('Comentario no encontrado');
      error.status = 404;
      throw error;
    }

    if (comentario.usuarioId !== usuarioId) {
      const error = new Error('No tienes permiso para eliminar este comentario');
      error.status = 403;
      throw error;
    }

    return await comentarioRepository.marcarEliminado(comentarioId);
  }
}

module.exports = new ComentarioService();