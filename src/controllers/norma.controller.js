const normaService = require('../services/norma.service');
const { ok, created, noContent } = require('../utils/apiResponse');

class NormaController {
  async listar(req, res, next) {
    try {
      const normas = await normaService.listar(req.query);
      return ok(res, normas);
    } catch (err) {
      next(err);
    }
  }

  async listarActivas(req, res, next) {
    try {
      const normas = await normaService.listarActivas();
      return ok(res, normas);
    } catch (err) {
      next(err);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const norma = await normaService.obtenerPorId(req.params.id);
      return ok(res, norma);
    } catch (err) {
      next(err);
    }
  }

  async crear(req, res, next) {
    try {
      const norma = await normaService.crearNorma(req.body);
      return created(res, norma);
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req, res, next) {
    try {
      const norma = await normaService.actualizar(req.params.id, req.body);
      return ok(res, norma);
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req, res, next) {
    try {
      await normaService.eliminar(req.params.id);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NormaController();