const reporteRepository = require('../repositories/reporte.repository');
const archivoRepository = require('../repositories/archivo.repository');
const comentarioRepository = require('../repositories/comentario.repository');
const dislikeArchivoRepository = require('../repositories/dislikeArchivo.repository');
const dislikeComentarioRepository = require('../repositories/dislikeComentario.repository');

class ReporteService {
  async crearReporte({ usuarioId, tipoContenido, archivoId, comentarioId, puntuacion, motivo }) {
    if (!usuarioId || !tipoContenido || (!archivoId && !comentarioId)) {
      const error = new Error('Faltan datos para crear el reporte');
      error.status = 400;
      throw error;
    }

    if (tipoContenido === 'archivo' && !archivoId) {
      const error = new Error('Debe indicar el archivo reportado');
      error.status = 400;
      throw error;
    }

    if (tipoContenido === 'comentario' && !comentarioId) {
      const error = new Error('Debe indicar el comentario reportado');
      error.status = 400;
      throw error;
    }

    if (await reporteRepository.yaReportadoPorUsuario(usuarioId, archivoId, comentarioId)) {
      const error = new Error('Ya has reportado este contenido');
      error.status = 409;
      throw error;
    }

    const contenido = archivoId
      ? await archivoRepository.buscarPorId(archivoId)
      : await comentarioRepository.buscarPorId(comentarioId);

    if (!contenido) {
      const error = new Error('Contenido a reportar no encontrado');
      error.status = 404;
      throw error;
    }

    const reporte = await reporteRepository.crear({
      reportadoPor: usuarioId,
      tipoContenido,
      archivoId,
      comentarioId,
      puntuacion,
    });

    return reporte;
  }

  async listarPendientes() {
    const reportes = await reporteRepository.listarPendientes();

    // El include anidado (archivo/comentario) no trae los contadores
    // calculados (esos son subconsultas que solo arma archivo.repository.js /
    // comentario.repository.js en sus propias consultas). Los agregamos aquí
    // reutilizando los repositorios de dislikes que ya existen, para que el
    // front pueda mostrar "cuántos dislikes tiene" sin pedirlo aparte.
    return await Promise.all(
      reportes.map(async (reporte) => {
        const plano = reporte.toJSON();
        if (plano.tipoContenido === 'archivo' && plano.archivoId) {
          plano.totalDislikes = await dislikeArchivoRepository.contarPorArchivo(plano.archivoId);
        } else if (plano.tipoContenido === 'comentario' && plano.comentarioId) {
          plano.totalDislikes = await dislikeComentarioRepository.contarPorComentario(plano.comentarioId);
        }
        return plano;
      })
    );
  }

  // El admin resuelve un reporte (manual o automático por dislikes) con UNA
  // de dos decisiones posibles:
  //
  //  - estado = 'descartado' -> "visto bueno": el contenido está bien, no
  //    había ninguna falta real. Se restaura (vuelve a ser visible/publicado)
  //    y se le limpian los dislikes acumulados para que no se vuelva a
  //    ocultar solo de inmediato.
  //
  //  - estado = 'resuelto'   -> "visto malo": se confirma la falta. El
  //    contenido se BORRA definitivamente de la base de datos. No hay
  //    vuelta atrás.
  async resolverReporte({ reporteId, resueltoPor, estado, accionTomada }) {
    if (!['resuelto', 'descartado'].includes(estado)) {
      const error = new Error('Estado de reporte inválido');
      error.status = 400;
      throw error;
    }

    const reporte = await reporteRepository.buscarPorId(reporteId);
    if (!reporte) {
      const error = new Error('Reporte no encontrado');
      error.status = 404;
      throw error;
    }

    if (reporte.estado !== 'pendiente') {
      const error = new Error('Este reporte ya fue resuelto anteriormente');
      error.status = 409;
      throw error;
    }

    if (estado === 'resuelto') {
      // Se confirma la falta -> se borra el contenido definitivamente.
      // OJO: esto también borra en cascada la propia fila de "reportes"
      // (archivo_id / comentario_id tienen ON DELETE CASCADE en la tabla
      // reportes), así que no hay nada que actualizar después.
      if (reporte.tipoContenido === 'archivo') {
        await archivoRepository.eliminar(reporte.archivoId);
      } else {
        await comentarioRepository.eliminarDefinitivo(reporte.comentarioId);
      }

      return {
        id: reporteId,
        estado: 'resuelto',
        accionTomada: accionTomada || 'Contenido eliminado definitivamente',
      };
    }

    // descartado -> el contenido no tenía problema real: se restaura y se
    // le limpian los dislikes acumulados.
    if (reporte.tipoContenido === 'archivo') {
      await archivoRepository.restaurarPublicado(reporte.archivoId);
      await dislikeArchivoRepository.eliminarTodosPorArchivo(reporte.archivoId);
    } else {
      await comentarioRepository.restaurarVisible(reporte.comentarioId);
      await dislikeComentarioRepository.eliminarTodosPorComentario(reporte.comentarioId);
    }

    return await reporteRepository.actualizarEstado(reporteId, estado, resueltoPor, accionTomada);
  }
}

module.exports = new ReporteService();