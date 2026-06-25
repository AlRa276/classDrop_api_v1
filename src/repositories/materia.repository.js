const { Materia, Cuatrimestre } = require('../models');

class MateriaRepository {
  async listarTodas() {
    return await Materia.findAll({
      where: { activo: true },
      include: [{ model: Cuatrimestre, as: 'cuatrimestre' }],
      order: [['nombre', 'ASC']],
    });
  }

  async listarPorCuatrimestre(cuatrimestreId) {
    return await Materia.findAll({
      where: { cuatrimestreId, activo: true },
    });
  }

  async buscarPorId(id) {
    return await Materia.findByPk(id);
  }

  async buscarPorNombreYCuatrimestre(nombre, cuatrimestreId) {
    return await Materia.findOne({ where: { nombre, cuatrimestreId } });
  }

  async crear(datos) {
    return await Materia.create(datos);
  }
}

module.exports = new MateriaRepository();