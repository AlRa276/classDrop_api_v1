// Importaciones modulares de Firebase Admin
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  } catch (error) {
    console.error('Error al procesar FIREBASE_CREDENTIALS en Railway:', error);
  }
} else {
  try {
    // Modo local
    serviceAccount = require('../../path-to-your-firebase-key.json'); 
  } catch (error) {
    console.warn('No se encontró el archivo JSON local de Firebase.');
  }
}

// Variable para guardar la app
let app;

// Inicializamos la app con la función 'cert' importada
if (serviceAccount) {
  try {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin inicializado correctamente.');
  } catch (error) {
    console.error('Error inicializando Firebase Admin:', error);
  }
}

// Exportamos 'getMessaging' para que los servicios puedan enviar notificaciones
module.exports = { getMessaging };