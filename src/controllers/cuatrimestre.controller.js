const cuatrimestreService = require('../services/cuatrimestre.service');
const { ok } = require('../utils/apiResponse');

class CuatrimestreController {
  async listar(req, res, next) {
    try {
      const cuatrimestres = await cuatrimestreService.listarTodos();
      return ok(res, cuatrimestres);
    } catch (err) {
      next(err);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const cuatrimestre = await cuatrimestreService.obtenerPorId(req.params.id);
      return ok(res, cuatrimestre);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new CuatrimestreController();
