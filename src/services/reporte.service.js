const reporteRepository = require('../repositories/reporte.repository');
const archivoRepository = require('../repositories/archivo.repository');
const comentarioRepository = require('../repositories/comentario.repository');

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
    return await reporteRepository.listarPendientes();
  }

  async resolverReporte({ reporteId, resueltoPor, estado, accionTomada }) {
    if (!['resuelto', 'descartado'].includes(estado)) {
      const error = new Error('Estado de reporte inválido');
      error.status = 400;
      throw error;
    }

    const reporte = await reporteRepository.actualizarEstado(reporteId, estado, resueltoPor, accionTomada);
    if (!reporte) {
      const error = new Error('Reporte no encontrado');
      error.status = 404;
      throw error;
    }

    return reporte;
  }
}

module.exports = new ReporteService();
