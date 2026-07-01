const express = require('express');
const router = express.Router();
const dislikeArchivoController = require('../controllers/dislikeArchivo.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/:archivoId', authMiddleware, dislikeArchivoController.darDislike);
router.delete('/:archivoId', authMiddleware, dislikeArchivoController.quitarDislike);

module.exports = router;