const archivoRepository = require('../repositories/archivo.repository');
const archivoAdjuntoRepository = require('../repositories/archivoAdjunto.repository');
const materiaRepository = require('../repositories/materia.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const etapaPublicacionService = require('./etapaPublicacion.service');
const moderacionIaClient = require('./moderacionIa.client');
const { sendPushNotification } = require('./notificacion.service');

const FORMATO_PERMITIDO = ['pdf', 'png', 'jpg', 'c'];
const TAMANO_MAXIMO_BYTES = 20 * 1024 * 1024; // 20 MB
const MIME_EXTENSION_MAP = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// Dominios permitidos para archivos de tipo 'url'. Se aceptan también
// subdominios (ej. "gist.github.com", "m.youtube.com").
const DOMINIOS_URL_PERMITIDOS = ['github.com', 'youtube.com', 'youtu.be'];

function validarUrl(urlTexto) {
  let url;
  try {
    url = new URL(urlTexto);
  } catch {
    return false; // ni siquiera es una URL bien formada
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false;
  }

  return DOMINIOS_URL_PERMITIDOS.some(
    (dominio) => url.hostname === dominio || url.hostname.endsWith(`.${dominio}`)
  );
}

function obtenerExtension(adjunto) {
  const extensionRaw = adjunto.extension;
  if (extensionRaw) {
    return extensionRaw.toString().trim().toLowerCase();
  }

  const nombreOriginal = adjunto.nombreOriginal;
  if (nombreOriginal) {
    const match = nombreOriginal.toString().trim().toLowerCase().match(/\.([a-z0-9]+)$/);
    if (match) {
      return match[1];
    }
  }

  const tipoMime = adjunto.tipoMime;
  if (tipoMime) {
    const mime = tipoMime.toString().split(';')[0].trim().toLowerCase();
    if (MIME_EXTENSION_MAP[mime]) {
      return MIME_EXTENSION_MAP[mime];
    }
    const partes = mime.split('/');
    if (partes.length === 2) {
      return partes[1] === 'jpeg' ? 'jpg' : partes[1];
    }
  }

  return null;
}

class ArchivoService {
 async actualizarEstado(archivoId, { estado, motivoRechazo }) {
    const estadosValidos = ['pendiente', 'escaneando', 'revision_calidad', 'publicado', 'rechazado'];

    if (!estado || !estadosValidos.includes(estado)) {
      const error = new Error('Estado de archivo inválido');
      error.status = 400;
      throw error;
    }
    console.log('DEBUG: Intentando notificar a usuario:', usuarioPropietario?.correo);
        console.log('DEBUG: Token encontrado:', usuarioPropietario?.fcmToken);
        // ---------------------------------

    if (estado === 'rechazado') {
      const motivo = motivoRechazo?.toString().trim();
      if (!motivo) {
        const error = new Error('Debe indicar el motivo de rechazo');
        error.status = 400;
        throw error;
      }
    }

    // 2. ACTUALIZAMOS EN BD
    const archivo = await archivoRepository.actualizarEstado(archivoId, estado, motivoRechazo);
    if (!archivo) {
      const error = new Error('Archivo no encontrado');
      error.status = 404;
      throw error;
    }

    // 3. LÓGICA DE NOTIFICACIÓN
    // Solo enviamos si el estado es 'publicado' o 'rechazado'
    if (estado === 'publicado' || estado === 'rechazado') {
      try {
        // Buscamos al dueño del archivo para obtener su FcmToken
        const usuarioPropietario = await usuarioRepository.buscarPorId(archivo.subidoPor);
        
        if (usuarioPropietario && usuarioPropietario.fcmToken) {
          const esAprobado = estado === 'publicado';
          const titulo = esAprobado ? '✅ Archivo Aprobado' : '❌ Archivo Rechazado';
          const cuerpo = esAprobado 
            ? `Tu archivo "${archivo.titulo}" ha sido aceptado y ya está público en ClassDrop.` 
            : `Tu archivo "${archivo.titulo}" fue rechazado. Motivo: ${motivoRechazo}`;

          // Disparamos la notificación
          await sendPushNotification(usuarioPropietario.fcmToken, titulo, cuerpo);
        }
      } catch (notifError) {
        // Capturamos el error para que la actualización del archivo no falle si la notificación falla
        console.error('Error al enviar notificación push en archivo.service:', notifError);
      }
    }

    return archivo;
  }
  async crearArchivo({ titulo, descripcion, tipo, subidoPor, materiaId, adjuntos }) {
    if (!titulo || !materiaId || !subidoPor || !Array.isArray(adjuntos) || adjuntos.length === 0) {
      const error = new Error('Debe completar título, materia, usuario y adjuntar al menos un archivo');
      error.status = 400;
      throw error;
    }

    const usuario = await usuarioRepository.buscarPorId(subidoPor);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const materia = await materiaRepository.buscarPorId(materiaId);
    if (!materia || !materia.activo) {
      const error = new Error('Materia inválida');
      error.status = 400;
      throw error;
    }

    const archivosValidos = adjuntos.every((adjunto) => {
      const extension = obtenerExtension(adjunto);
      if (!extension || !adjunto.tamanoBytes) return false;
      return FORMATO_PERMITIDO.includes(extension);
    });

    if (!archivosValidos) {
      const error = new Error('Solo se permiten archivos con extensión .pdf, .png, .jpg y .c');
      error.status = 400;
      throw error;
    }

    const tamanoValido = adjuntos.every((adjunto) => adjunto.tamanoBytes <= TAMANO_MAXIMO_BYTES);
    if (!tamanoValido) {
      const error = new Error('El tamaño máximo por archivo es 20 MB');
      error.status = 400;
      throw error;
    }

    const archivo = await archivoRepository.crear({
      titulo,
      descripcion,
      tipo,
      subidoPor,
      materiaId,
      estado: 'pendiente',
    });

    const listaAdjuntos = adjuntos.map((adjunto, index) => ({
      archivoId: archivo.id,
      urlStorage: adjunto.urlStorage,
      nombreOriginal: adjunto.nombreOriginal,
      tipoMime: adjunto.tipoMime,
      tamanoBytes: adjunto.tamanoBytes,
      numPaginas: adjunto.numPaginas,
      orden: index,
    }));

    await archivoAdjuntoRepository.crearMultiples(listaAdjuntos);
    await etapaPublicacionService.inicializar(archivo.id);
    return archivo;
  }

  async obtenerPorId(id, usuarioActualId) {
    const archivo = await archivoRepository.buscarPorId(id, usuarioActualId);
    if (!archivo) {
      const error = new Error('Archivo no encontrado');
      error.status = 404;
      throw error;
    }
    return archivo;
  }

  async listarPublicados(params) {
    return await archivoRepository.listarPublicados(params);
  }

  async listarPendientes(params) {
    return await archivoRepository.listarPendientes(params);
  }

  async listarPorUsuario(usuarioId, params) {
    return await archivoRepository.listarPorUsuario(usuarioId, params);
  }

  async contarPublicadosPorUsuario(usuarioId) {
    return await archivoRepository.contarPorUsuario(usuarioId, 'publicado');
  }

  async eliminarArchivo(usuarioId, archivoId) {
    const archivo = await archivoRepository.buscarPorId(archivoId);
    if (!archivo) {
      const error = new Error('Archivo no encontrado');
      error.status = 404;
      throw error;
    }

    if (archivo.subidoPor !== usuarioId) {
      const error = new Error('No tienes permiso para eliminar este archivo');
      error.status = 403;
      throw error;
    }

    await archivoRepository.eliminar(archivoId);
    return true;
  }

  
}

module.exports = new ArchivoService();