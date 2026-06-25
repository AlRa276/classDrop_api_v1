const express = require('express');
const router = express.Router();
const likeArchivoController = require('../controllers/likeArchivo.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/:archivoId', authMiddleware, likeArchivoController.darLike);
router.delete('/:archivoId', authMiddleware, likeArchivoController.quitarLike);

module.exports = router;
