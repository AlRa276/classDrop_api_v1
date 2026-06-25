const normaRepository = require('../repositories/norma.repository');

class NormaService {
  async crearNorma(datos) {
    return await normaRepository.crear(datos);
  }

  async obtenerPorId(id) {
    const norma = await normaRepository.buscarPorId(id);
    if (!norma) {
      const error = new Error('Norma no encontrada');
      error.status = 404;
      throw error;
    }
    return norma;
  }

  async listar(filtro = {}) {
    return await normaRepository.listar(filtro);
  }

  async listarActivas() {
    return await normaRepository.listarActivas();
  }

  async actualizar(id, datos) {
    const norma = await normaRepository.actualizar(id, datos);
    if (!norma) {
      const error = new Error('Norma no encontrada');
      error.status = 404;
      throw error;
    }
    return norma;
  }

  async eliminar(id) {
    const eliminado = await normaRepository.eliminar(id);
    if (!eliminado) {
      const error = new Error('Norma no encontrada');
      error.status = 404;
      throw error;
    }
    return true;
  }
}

module.exports = new NormaService();