const admin = require('firebase-admin');
// Carga el archivo JSON descargado desde la consola de Firebase
const serviceAccount = require('../../google-services.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;