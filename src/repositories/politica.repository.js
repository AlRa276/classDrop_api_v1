const { Op } = require('sequelize');
const { Politica } = require('../models');

class PoliticaRepository {
  async listar(filtro = {}) {
    const where = {};

    if (filtro.categoria) {
      where.categoria = filtro.categoria;
    }
    if (filtro.soloActivas) {
      where.activo = true;
    }

    return await Politica.findAll({
      where,
      order: [['esPrincipal', 'DESC'], ['orden', 'ASC'], ['createdAt', 'ASC']],
    });
  }

  async buscarPorId(id) {
    return await Politica.findByPk(id);
  }

  async obtenerPrincipal() {
    return await Politica.findOne({ where: { esPrincipal: true, activo: true } });
  }

  async crear(datos) {
    return await Politica.create(datos);
  }

  async actualizar(id, datos) {
    const politica = await this.buscarPorId(id);
    if (!politica) return null;
    return await politica.update(datos);
  }

  async eliminar(id) {
    const politica = await this.buscarPorId(id);
    if (!politica) return null;
    await politica.update({ activo: false });
    return true;
  }

  async desmarcarPrincipales(exceptoId = null) {
    const where = { esPrincipal: true };
    if (exceptoId) {
      where.id = { [Op.ne]: exceptoId };
    }
    return await Politica.update({ esPrincipal: false }, { where });
  }
}

module.exports = new PoliticaRepository();