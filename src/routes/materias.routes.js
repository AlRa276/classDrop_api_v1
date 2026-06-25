const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materia.controller');

router.get('/', materiaController.listarTodas);
router.get('/cuatrimestre/:cuatrimestreId', materiaController.listarPorCuatrimestre);
router.get('/:id', materiaController.obtenerPorId);

module.exports = router;
