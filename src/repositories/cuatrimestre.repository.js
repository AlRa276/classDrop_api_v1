const { Cuatrimestre } = require('../models');

class CuatrimestreRepository {
  async listarTodos() {
    return await Cuatrimestre.findAll({ order: [['id', 'ASC']] });
  }

  async buscarPorId(id) {
    return await Cuatrimestre.findByPk(id);
  }
}

module.exports = new CuatrimestreRepository();