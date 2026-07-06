const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/archivo/:id', authMiddleware, comentarioController.listarPorArchivo);
router.post('/', authMiddleware, comentarioController.crear);
router.delete('/:id', authMiddleware, comentarioController.eliminar);

module.exports = router;