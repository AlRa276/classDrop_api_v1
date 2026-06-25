const express = require('express');
const router = express.Router();
const cuatrimestreController = require('../controllers/cuatrimestre.controller');

router.get('/', cuatrimestreController.listar);
router.get('/:id', cuatrimestreController.obtenerPorId);

module.exports = router;
