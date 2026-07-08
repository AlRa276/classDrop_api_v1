const { Notificacion } = require('../models');

class NotificacionRepository {
  async crear(datos) {
    return await Notificacion.create(datos);
  }

  async listarPorUsuario(usuarioId, { limite = 30, offset = 0 } = {}) {
    return await Notificacion.findAndCountAll({
      where: { usuarioId },
      limit: limite,
      offset,
      order: [['creado_en', 'DESC']],
    });
  }

  async contarNoLeidas(usuarioId) {
    return await Notificacion.count({ where: { usuarioId, leida: false } });
  }

  async marcarLeida(id, usuarioId) {
    // El where incluye usuarioId a propósito: así un usuario nunca puede
    // marcar como leída una notificación que no es suya.
    const notificacion = await Notificacion.findOne({ where: { id, usuarioId } });
    if (!notificacion) return null;
    return await notificacion.update({ leida: true });
  }

  async marcarTodasLeidas(usuarioId) {
    return await Notificacion.update(
      { leida: true },
      { where: { usuarioId, leida: false } }
    );
  }
}

module.exports = new NotificacionRepository();