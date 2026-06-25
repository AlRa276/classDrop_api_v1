const express = require('express');
const router = express.Router();
const likesComentarioController = require('../controllers/likesComentario.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/:comentarioId', authMiddleware, likesComentarioController.darLike);
router.delete('/:comentarioId', authMiddleware, likesComentarioController.quitarLike);

module.exports = router;
