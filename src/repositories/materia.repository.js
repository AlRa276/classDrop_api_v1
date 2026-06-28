const { Op } = require('sequelize');
const { Materia, Cuatrimestre } = require('../models');

class MateriaRepository {
  async listarTodas(filtro = {}) {
    const where = { activo: true };

    if (filtro.search) {
      where.nombre = { [Op.iLike]: `%${filtro.search}%` };
    }

    const opciones = {
      where,
      include: [{ model: Cuatrimestre, as: 'cuatrimestre' }],
      order: [['nombre', 'ASC']],
    };

    if (filtro.limit) {
      opciones.limit = filtro.limit;
    }

    return await Materia.findAll(opciones);
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

  async actualizar(id, datos) {
    const materia = await this.buscarPorId(id);
    if (!materia) return null;
    return await materia.update(datos);
  }

  async eliminar(id) {
    const materia = await this.buscarPorId(id);
    if (!materia) return null;
    await materia.update({ activo: false });
    return true;
  }
}

module.exports = new MateriaRepository();