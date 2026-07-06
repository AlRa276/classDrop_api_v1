const guardadosArchivoService = require('../services/guardadosArchivo.service');
const { ok, created, noContent } = require('../utils/apiResponse');

class GuardadosArchivoController {
  async guardar(req, res, next) {
    try {
      const guardado = await guardadosArchivoService.guardarArchivo(req.usuario.id, req.params.archivoId);
      return created(res, guardado);
    } catch (err) {
      next(err);
    }
  }

  async quitar(req, res, next) {
    try {
      await guardadosArchivoService.quitarGuardado(req.usuario.id, req.params.archivoId);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }

  async listarPorUsuario(req, res, next) {
    try {
      const guardados = await guardadosArchivoService.listarPorUsuario(req.usuario.id);
      return ok(res, guardados);
    } catch (err) {
      next(err);
    }
  }

  async listarArchivosGuardados(req, res, next) {
    try {
      const archivos = await guardadosArchivoService.listarArchivosGuardados(req.usuario.id);
      return ok(res, archivos);
    } catch (err) {
      next(err);
    }
  }

  async contarPorUsuario(req, res, next) {
    try {
      const total = await guardadosArchivoService.contarPorUsuario(req.usuario.id);
      return ok(res, { total });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GuardadosArchivoController();