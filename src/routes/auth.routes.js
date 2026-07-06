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

module.exports = router;