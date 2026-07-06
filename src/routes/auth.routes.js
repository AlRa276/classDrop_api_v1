// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/registro', authController.registrar);
router.post('/registro/admin', authController.registrarAdmin);
router.post('/login', authController.login);
router.get('/perfil', authMiddleware, authController.perfil);
router.post('/logout', authMiddleware, authController.logout);

// NUEVA RUTA PARA ACTUALIZAR TOKEN FCM
router.put('/fcm-token', authMiddleware, authController.actualizarFcmToken);

// ==========================================
//   NUEVAS RUTAS PARA VERIFICACIÓN EN 2 PASOS (2FA)
// ==========================================

// 1. Generar la clave secreta de 6 dígitos (Requiere estar logueado con Token)
router.post('/2fa/generar', authMiddleware, authController.generar2FA);

// 2. Verificar el primer código para activar el 2FA definitivamente (Requiere Token)
router.post('/2fa/activar', authMiddleware, authController.activar2FA);

// 3. Paso 2 del Login: Verificar código de 6 dígitos para obtener el JWT (Pública)
router.post('/login/2fa', authController.login2FA);

module.exports = router;