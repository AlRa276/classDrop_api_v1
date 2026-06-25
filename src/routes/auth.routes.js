const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
// router.get('/perfil', authMiddleware, authController.perfil); // se activa cuando tengamos el middleware de JWT

module.exports = router;