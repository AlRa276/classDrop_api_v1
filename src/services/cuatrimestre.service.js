const cuatrimestreRepository = require('../repositories/cuatrimestre.repository');

class CuatrimestreService {
  async listarTodos() {
    return await cuatrimestreRepository.listarTodos();
  }

  async obtenerPorId(id) {
    const cuatrimestre = await cuatrimestreRepository.buscarPorId(id);
    if (!cuatrimestre) {
      const error = new Error('Cuatrimestre no encontrado');
      error.status = 404;
      throw error;
    }
    return cuatrimestre;
  }
}

module.exports = new CuatrimestreService();
