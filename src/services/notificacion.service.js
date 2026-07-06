// src/services/notificacion.service.js
const { getMessaging } = require('../config/firebase');

const sendPushNotification = async (fcmToken, title, body) => {
  if (!fcmToken) return;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken, // El token de PostgreSQL
  };

  try {
    // Usamos la nueva sintaxis modular de Firebase
    const response = await getMessaging().send(message);
    console.log('Notificación push enviada con éxito:', response);
    return response;
  } catch (error) {
    console.error('Error enviando notificación push:', error);
  }
};

module.exports = { sendPushNotification };