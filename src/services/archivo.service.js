const archivoRepository = require('../repositories/archivo.repository');
const archivoAdjuntoRepository = require('../repositories/archivoAdjunto.repository');
const materiaRepository = require('../repositories/materia.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const etapaPublicacionService = require('./etapaPublicacion.service');
const moderacionIaClient = require('./moderacionIa.client');
const { notificarUsuario } = require('./notificacion.service');
const analyticsService = require('./analytics.service');

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
        const usuarioPropietario = await usuarioRepository.buscarPorId(archivo.subidoPor);

        if (usuarioPropietario) {
          const esAprobado = estado === 'publicado';
          const titulo = esAprobado ? 'Archivo Aprobado' : 'Archivo Rechazado';
          const cuerpo = esAprobado 
            ? `Tu archivo "${archivo.titulo}" ha sido aceptado y ya está público en ClassDrop.` 
            : `Tu archivo "${archivo.titulo}" fue rechazado. Motivo: ${motivoRechazo}`;

          // Guarda la notificación en BD (aparece en la pantalla de
          // notificaciones) y, si hay fcmToken, también manda el push.
          await notificarUsuario({
            usuarioId: usuarioPropietario.id,
            fcmToken: usuarioPropietario.fcmToken,
            titulo,
            cuerpo,
            tipo: esAprobado ? 'exito' : 'error',
            archivoId: archivo.id,
          });
        }
      } catch (notifError) {
        console.error('Error al enviar notificación en archivo.service:', notifError);
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

    analyticsService.registrarEvento({
      usuarioId: usuario.id,
      nombreEvento: 'subir_archivo',
      params: {
        materia: materia.nombre,
        tipo_archivo: tipo,
      },
    });

    // La moderación con IA puede tardar MINUTOS (el Nivel 3 corre modelos
    // DistilBERT en CPU). Para que el estudiante no se quede esperando (y para
    // que Android no truene su propio timeout de red), la disparamos en
    // SEGUNDO PLANO, sin "await": esta función responde de inmediato con el
    // archivo recién creado (estado 'pendiente'). El veredicto de la IA se
    // aplica después, cuando llegue, sin bloquear esta petición.
    this._moderarEnSegundoPlano({
      archivo,
      primerAdjunto: listaAdjuntos[0],
      usuario,
      materia,
    }).catch((err) => {
      console.error('Error inesperado en moderación en segundo plano:', err);
    });

    return archivo;
  }

  // Corre el análisis del microservicio de IA DESPUÉS de haberle respondido
  // al cliente, y aplica el veredicto cuando llegue (en segundos o minutos).
  // Nunca lanza hacia afuera: cualquier error queda solo en el log, sin
  // afectar nada más (el archivo ya se creó y ya se le respondió al usuario).
  async _moderarEnSegundoPlano({ archivo, primerAdjunto, usuario, materia }) {
    let veredictoFinal = null;
    let motivoIa = null;

    try {
      const resultadoModeracion = await moderacionIaClient.moderarArchivo({
        archivoId: archivo.id,
        titulo: archivo.titulo,
        descripcion: archivo.descripcion,
        nombreArchivo: primerAdjunto.nombreOriginal,
        tipoMime: primerAdjunto.tipoMime,
        tamanoBytes: primerAdjunto.tamanoBytes,
        urlArchivo: primerAdjunto.urlStorage,
      });

      veredictoFinal = resultadoModeracion.veredictoFinal;
      motivoIa = resultadoModeracion.motivo || null;

      await archivoRepository.guardarResultadoIa(archivo.id, {
        puntajeRiesgo: resultadoModeracion.puntajeRiesgo,
        nivelesEjecutados: resultadoModeracion.nivelesEjecutados,
      });

      if (veredictoFinal === 'rechazar') {
        await archivoRepository.actualizarEstado(
          archivo.id,
          'rechazado',
          motivoIa || 'Rechazado automáticamente por el sistema de moderación.'
        );
      } else if (veredictoFinal === 'aprobar') {
        await archivoRepository.actualizarEstado(archivo.id, 'publicado');
      } else {
        // 'revisar': se queda pendiente, pero con el motivo real de la IA
        // guardado en motivo_rechazo como contexto para el admin.
        if (motivoIa) {
          await archivo.update({ motivoRechazo: motivoIa });
        }
      }

      // Si la IA decidió por su cuenta (aprobar o rechazar), avisamos al
      // estudiante igual que cuando lo hace un admin manualmente.
      if (veredictoFinal === 'rechazar' || veredictoFinal === 'aprobar') {
        try {
          const esAprobado = veredictoFinal === 'aprobar';
          await notificarUsuario({
            usuarioId: usuario.id,
            fcmToken: usuario.fcmToken,
            titulo: esAprobado ? 'Archivo Aprobado' : 'Archivo Rechazado',
            cuerpo: esAprobado
              ? `Tu archivo "${archivo.titulo}" ha sido aceptado y ya está público en ClassDrop.`
              : `Tu archivo "${archivo.titulo}" fue rechazado. Motivo: ${motivoIa || 'No cumple con las normas de la plataforma.'}`,
            tipo: esAprobado ? 'exito' : 'error',
            archivoId: archivo.id,
          });
        } catch (notifError) {
          console.error('Error al notificar resultado de moderación automática:', notifError);
        }
      }
    } catch (moderacionError) {
      // moderarArchivo() ya atrapa sus propios errores y devuelve 'revisar' por
      // defecto, así que esto solo cubre algo realmente inesperado.
      console.error('Error inesperado llamando al microservicio de moderación:', moderacionError);
    }

    // Solo avisamos a los admins si el archivo SIGUE necesitando revisión
    // humana (la IA no lo aprobó ni lo rechazó automáticamente).
    if (veredictoFinal !== 'rechazar' && veredictoFinal !== 'aprobar') {
      try {
        const admins = await usuarioRepository.listarAdmins();
        const tituloNotif = 'Nuevo archivo pendiente';
        const cuerpoNotif = `"${usuario.nombreCompleto}" subió "${archivo.titulo}" a ${materia.nombre}. Está esperando revisión.`;

        await Promise.all(
          admins.map((admin) =>
            notificarUsuario({
              usuarioId: admin.id,
              fcmToken: admin.fcmToken,
              titulo: tituloNotif,
              cuerpo: cuerpoNotif,
              tipo: 'advertencia',
              archivoId: archivo.id,
            })
          )
        );
      } catch (notifError) {
        console.error('Error al notificar a los admins sobre archivo pendiente:', notifError);
      }
    }
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