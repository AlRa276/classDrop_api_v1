const { getMessaging } = require('../config/firebase');
const notificacionRepository = require('../repositories/notificacion.repository');

const sendPushNotification = async (fcmToken, title, body) => {
  if (!fcmToken) return;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken,
  };

  try {
    const response = await getMessaging().send(message);
    console.log('Notificación push enviada con éxito:', response);
    return response;
  } catch (error) {
    console.error('Error enviando notificación push:', error);
  }
};

// Punto único para notificar a un usuario:
//  1) SIEMPRE guarda la notificación en la base de datos (para que aparezca
//     en la pantalla de notificaciones de la app, con su estado leída/no leída).
//  2) Si el usuario tiene un fcmToken registrado, también dispara el push
//     nativo del sistema operativo.
// Así, aunque el push falle (token vencido, sin conexión, etc.), la
// notificación siempre queda visible dentro de la app.
const notificarUsuario = async ({ usuarioId, fcmToken, titulo, cuerpo, tipo = 'info', archivoId = null }) => {
  try {
    await notificacionRepository.crear({ usuarioId, titulo, cuerpo, tipo, archivoId });
  } catch (error) {
    console.error('Error guardando notificación en base de datos:', error);
  }

  if (fcmToken) {
    await sendPushNotification(fcmToken, titulo, cuerpo);
  }
};

const listarPorUsuario = async (usuarioId, { limite, offset } = {}) => {
  return await notificacionRepository.listarPorUsuario(usuarioId, { limite, offset });
};

const contarNoLeidas = async (usuarioId) => {
  return await notificacionRepository.contarNoLeidas(usuarioId);
};

const marcarLeida = async (id, usuarioId) => {
  const notificacion = await notificacionRepository.marcarLeida(id, usuarioId);
  if (!notificacion) {
    const error = new Error('Notificación no encontrada');
    error.status = 404;
    throw error;
  }
  return notificacion;
};

const marcarTodasLeidas = async (usuarioId) => {
  await notificacionRepository.marcarTodasLeidas(usuarioId);
  return true;
};

module.exports = {
  sendPushNotification,
  notificarUsuario,
  listarPorUsuario,
  contarNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
};