const materiaService = require('../services/materia.service');
const { ok, created, noContent } = require('../utils/apiResponse');

class MateriaController {
  async listarTodas(req, res, next) {
    try {
      const materias = await materiaService.listarTodas(req.query);
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

  async crear(req, res, next) {
    try {
      const materia = await materiaService.crear(req.body);
      return created(res, materia);
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req, res, next) {
    try {
      const materia = await materiaService.actualizar(req.params.id, req.body);
      return ok(res, materia);
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req, res, next) {
    try {
      await materiaService.eliminar(req.params.id);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MateriaController();