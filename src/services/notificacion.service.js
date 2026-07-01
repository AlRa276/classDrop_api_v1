// src/services/notification.service.js
const admin = require('../config/firebase');

const sendPushNotification = async (fcmToken, title, body) => {
  if (!fcmToken) return;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken, // El token almacenado en tu BD PostgreSQL para ese usuario específico
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notificación push enviada con éxito:', response);
    return response;
  } catch (error) {
    console.error('Error enviando notificación push:', error);
  }
};

module.exports = { sendPushNotification };