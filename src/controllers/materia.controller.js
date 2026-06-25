const materiaService = require('../services/materia.service');
const { ok } = require('../utils/apiResponse');

class MateriaController {
  async listarTodas(req, res, next) {
    try {
      const materias = await materiaService.listarTodas();
      return ok(res, materias);
    } catch (err) {
      next(err);
    }
  }

  async listarPorCuatrimestre(req, res, next) {
    try {
      const materias = await materiaService.listarPorCuatrimestre(req.params.cuatrimestreId);
      return ok(res, materias);
    } catch (err) {
      next(err);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const materia = await materiaService.obtenerPorId(req.params.id);
      return ok(res, materia);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MateriaController();