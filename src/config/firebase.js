const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
  // 1. En producción (Railway), toma el texto de la variable y lo convierte a objeto
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  } catch (error) {
    console.error('Error al procesar FIREBASE_CREDENTIALS en Railway:', error);
  }
} else {
  // 2. En local, usa tu archivo físico (¡Asegúrate de que esté en tu .gitignore!)
  try {
    serviceAccount = require('../../path-to-your-firebase-key.json'); 
  } catch (error) {
    console.warn('No se encontró el archivo JSON local de Firebase.');
  }
}

// Inicializa la app solo si se encontraron las credenciales
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = admin;