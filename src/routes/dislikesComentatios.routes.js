const express = require('express');
const router = express.Router();
const dislikeComentarioController = require('../controllers/dislikeComentario.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/:comentarioId', authMiddleware, dislikeComentarioController.darDislike);
router.delete('/:comentarioId', authMiddleware, dislikeComentarioController.quitarDislike);

module.exports = router;