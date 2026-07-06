const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// 1. Verificamos si ya existe una app inicializada para evitar duplicados
if (!getApps().length) {
    let serviceAccount;

    if (process.env.FIREBASE_CREDENTIALS) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        } catch (error) {
            console.error('❌ Error crítico: JSON de Firebase inválido en env', error);
        }
    } else {
        console.warn('⚠️ No se encontró la variable FIREBASE_CREDENTIALS');
    }

    if (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount)
        });
        console.log('✅ Firebase Admin inicializado exitosamente.');
    } else {
        console.error('❌ No se pudo inicializar Firebase: credenciales faltantes.');
    }
}

// 2. Exportamos getMessaging directamente, 
// pero asegurándonos de que ya se haya intentado inicializar arriba
module.exports = { getMessaging };