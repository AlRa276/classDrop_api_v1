const materiaRepository = require('../repositories/materia.repository');

class MateriaService {
  async listarTodas(query = {}) {
    const filtro = {};

    if (query.search) {
      filtro.search = String(query.search).trim();
    }

    if (query.limit) {
      const limit = parseInt(query.limit, 10);
      if (Number.isNaN(limit) || limit <= 0) {
        const error = new Error('El parámetro limit debe ser un número entero positivo');
        error.status = 400;
        throw error;
      }
      filtro.limit = limit;
    }

    return await materiaRepository.listarTodas(filtro);
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

  async crear(datos) {
    const { nombre, cuatrimestreId } = datos;

    if (!nombre || !cuatrimestreId) {
      const error = new Error('Los campos nombre y cuatrimestreId son obligatorios');
      error.status = 422;
      throw error;
    }

    const existente = await materiaRepository.buscarPorNombreYCuatrimestre(nombre, cuatrimestreId);
    if (existente) {
      const error = new Error('Ya existe una materia con ese nombre en ese cuatrimestre');
      error.status = 409;
      error.field = 'nombre';
      throw error;
    }

    return await materiaRepository.crear(datos);
  }

  async actualizar(id, datos) {
    if (datos.nombre && datos.cuatrimestreId) {
      const existente = await materiaRepository.buscarPorNombreYCuatrimestre(datos.nombre, datos.cuatrimestreId);
      if (existente && existente.id !== id) {
        const error = new Error('Ya existe una materia con ese nombre en ese cuatrimestre');
        error.status = 409;
        error.field = 'nombre';
        throw error;
      }
    }

    const materia = await materiaRepository.actualizar(id, datos);
    if (!materia) {
      const error = new Error('Materia no encontrada');
      error.status = 404;
      throw error;
    }
    return materia;
  }

  async eliminar(id) {
    const eliminado = await materiaRepository.eliminar(id);
    if (!eliminado) {
      const error = new Error('Materia no encontrada');
      error.status = 404;
      throw error;
    }
    return true;
  }
}

module.exports = new MateriaService();