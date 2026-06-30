const politicaService = require('../services/politica.service');
const { ok, created, noContent } = require('../utils/apiResponse');

class PoliticaController {
  async listar(req, res, next) {
    try { 
        return ok(res, await politicaService.listar(req.query)); 
    } catch (err) { 
        next(err); 
    }
  }
  async obtenerPrincipal(req, res, next) {
    try { 
        return ok(res, await politicaService.obtenerPrincipal()); 

    } catch (err) { 
        next(err); 
    }
  }
  async obtenerPorId(req, res, next) {
    try { 
        return ok(res, await politicaService.obtenerPorId(req.params.id)); 

    } catch (err) { 
        next(err); 
    }
  }
  async crear(req, res, next) {
    try { 
        return created(res, await politicaService.crear(req.body)); 
    } catch (err) { 
        next(err); 
    }
  }
  async actualizar(req, res, next) {
    try { 
        return ok(res, await politicaService.actualizar(req.params.id, req.body)); 
    } catch (err) { 
        next(err); 
    }
  }
  async eliminar(req, res, next) {
    try { 
        await politicaService.eliminar(req.params.id); 
        return noContent(res); 
    } catch (err) { 
        next(err); 
    }
  }
}

module.exports = new PoliticaController();