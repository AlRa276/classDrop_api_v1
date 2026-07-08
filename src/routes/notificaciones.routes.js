const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacion.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, notificacionController.listar);
router.get('/no-leidas/contador', authMiddleware, notificacionController.contarNoLeidas);
router.patch('/leer-todas', authMiddleware, notificacionController.marcarTodasLeidas);
router.patch('/:id/leer', authMiddleware, notificacionController.marcarLeida);

module.exports = router;