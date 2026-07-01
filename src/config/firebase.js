const admin = require('firebase-admin');
// Carga el archivo JSON descargado desde la consola de Firebase
const serviceAccount = require('../../path-to-your-firebase-key.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;