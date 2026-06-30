const express = require('express');
const router = express.Router();
const politicaController = require('../controllers/politica.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/', politicaController.listar);
router.get('/principal', politicaController.obtenerPrincipal);
router.get('/:id', politicaController.obtenerPorId);
router.post('/', authMiddleware, adminMiddleware, politicaController.crear);
router.put('/:id', authMiddleware, adminMiddleware, politicaController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, politicaController.eliminar);

module.exports = router;