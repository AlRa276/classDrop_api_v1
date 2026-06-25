const archivoService = require('../services/archivo.service');
const { ok, created, noContent } = require('../utils/apiResponse');

class ArchivoController {
  async crear(req, res, next) {
    try {
      const archivo = await archivoService.crearArchivo({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        subidoPor: req.usuario.id,
        materiaId: req.body.materiaId,
        adjuntos: req.body.adjuntos,
      });
      return created(res, archivo);
    } catch (err) {
      next(err);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const archivo = await archivoService.obtenerPorId(req.params.id);
      return ok(res, archivo);
    } catch (err) {
      next(err);
    }
  }

  async listarPublicados(req, res, next) {
    try {
      const { materiaId, limite, offset } = req.query;
      const resultado = await archivoService.listarPublicados({
        materiaId,
        limite: limite ? Number(limite) : 20,
        offset: offset ? Number(offset) : 0,
      });
      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req, res, next) {
    try {
      await archivoService.eliminarArchivo(req.usuario.id, req.params.id);
      return noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArchivoController();