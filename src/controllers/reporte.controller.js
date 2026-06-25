const reporteService = require('../services/reporte.service');
const { ok, created } = require('../utils/apiResponse');

class ReporteController {
  async crear(req, res, next) {
    try {
      const reporte = await reporteService.crearReporte({
        usuarioId: req.usuario.id,
        tipoContenido: req.body.tipoContenido,
        archivoId: req.body.archivoId,
        comentarioId: req.body.comentarioId,
        puntuacion: req.body.puntuacion,
      });
      return created(res, reporte);
    } catch (err) {
      next(err);
    }
  }

  async listarPendientes(req, res, next) {
    try {
      const reportes = await reporteService.listarPendientes();
      return ok(res, reportes);
    } catch (err) {
      next(err);
    }
  }

  async resolver(req, res, next) {
    try {
      const reporte = await reporteService.resolverReporte({
        reporteId: req.params.id,
        resueltoPor: req.usuario.id,
        estado: req.body.estado,
        accionTomada: req.body.accionTomada,
      });
      return ok(res, reporte);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReporteController();