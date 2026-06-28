const politicaRepository = require('../repositories/politica.repository');

const CATEGORIAS_VALIDAS = ['privacidad', 'seguridad', 'reglamento_interno', 'terminos_uso', 'general'];

class PoliticaService {
  async listar(query = {}) {
    const filtro = { soloActivas: true };

    if (query.categoria && query.categoria !== 'todas') {
      if (!CATEGORIAS_VALIDAS.includes(query.categoria)) {
        const error = new Error('Categoría de política inválida');
        error.status = 400;
        throw error;
      }
      filtro.categoria = query.categoria;
    }

    return await politicaRepository.listar(filtro);
  }

  async obtenerPrincipal() {
    const principal = await politicaRepository.obtenerPrincipal();
    if (!principal) {
      const error = new Error('No hay un mensaje principal configurado');
      error.status = 404;
      throw error;
    }
    return principal;
  }

  async obtenerPorId(id) {
    const politica = await politicaRepository.buscarPorId(id);
    if (!politica) {
      const error = new Error('Política no encontrada');
      error.status = 404;
      throw error;
    }
    return politica;
  }

  async crear(datos) {
    const { titulo, contenido, categoria } = datos;

    if (!titulo || !contenido) {
      const error = new Error('Los campos título y contenido son obligatorios');
      error.status = 422;
      throw error;
    }

    if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
      const error = new Error('Categoría de política inválida');
      error.status = 400;
      throw error;
    }

    if (datos.esPrincipal) {
      await politicaRepository.desmarcarPrincipales();
    }

    return await politicaRepository.crear(datos);
  }

  async actualizar(id, datos) {
    if (datos.categoria && !CATEGORIAS_VALIDAS.includes(datos.categoria)) {
      const error = new Error('Categoría de política inválida');
      error.status = 400;
      throw error;
    }

    if (datos.esPrincipal) {
      await politicaRepository.desmarcarPrincipales(id);
    }

    const politica = await politicaRepository.actualizar(id, datos);
    if (!politica) {
      const error = new Error('Política no encontrada');
      error.status = 404;
      throw error;
    }
    return politica;
  }

  async eliminar(id) {
    const eliminado = await politicaRepository.eliminar(id);
    if (!eliminado) {
      const error = new Error('Política no encontrada');
      error.status = 404;
      throw error;
    }
    return true;
  }
}

module.exports = new PoliticaService();