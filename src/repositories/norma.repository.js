const { Norma } = require('../models');

class NormaRepository {
  async crear(datos) {
    return await Norma.create(datos);
  }

  async buscarPorId(id) {
    return await Norma.findByPk(id);
  }

  async listar(filtro = {}) {
    const where = {};
    if (filtro.estado) {
      where.estado = filtro.estado;
    }
    return await Norma.findAll({
      where,
      order: [['creado_en', 'DESC']]
    });
  }

  async listarActivas() {
    return await Norma.findAll({
      where: { estado: 'activa' },
      order: [['creado_en', 'DESC']]
    });
  }

  async actualizar(id, datos) {
    const norma = await this.buscarPorId(id);
    if (!norma) return null;
    return await norma.update(datos);
  }

  async eliminar(id) {
    const norma = await this.buscarPorId(id);
    if (!norma) return null;
    await norma.destroy();
    return true;
  }

  async contar() {
    return await Norma.count();
  }
}

module.exports = new NormaRepository();
