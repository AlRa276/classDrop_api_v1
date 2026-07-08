const notificacionService = require('../services/notificacion.service');
const { ok } = require('../utils/apiResponse');

class NotificacionController {
  async listar(req, res, next) {
    try {
      const { limite, offset } = req.query;
      const resultado = await notificacionService.listarPorUsuario(req.usuario.id, {
        limite: limite ? Number(limite) : 30,
        offset: offset ? Number(offset) : 0,
      });
      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async contarNoLeidas(req, res, next) {
    try {
      const total = await notificacionService.contarNoLeidas(req.usuario.id);
      return ok(res, { total });
    } catch (err) {
      next(err);
    }
  }

  async marcarLeida(req, res, next) {
    try {
      const notificacion = await notificacionService.marcarLeida(req.params.id, req.usuario.id);
      return ok(res, notificacion);
    } catch (err) {
      next(err);
    }
  }

  async marcarTodasLeidas(req, res, next) {
    try {
      await notificacionService.marcarTodasLeidas(req.usuario.id);
      return ok(res, { actualizado: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificacionController();