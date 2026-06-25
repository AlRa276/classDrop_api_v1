const materiaRepository = require('../repositories/materia.repository');

class MateriaService {
  async listarTodas() {
    return await materiaRepository.listarTodas();
  }

  async listarPorCuatrimestre(cuatrimestreId) {
    return await materiaRepository.listarPorCuatrimestre(cuatrimestreId);
  }

  async obtenerPorId(id) {
    const materia = await materiaRepository.buscarPorId(id);
    if (!materia) {
      const error = new Error('Materia no encontrada');
      error.status = 404;
      throw error;
    }
    return materia;
  }
}

module.exports = new MateriaService();
