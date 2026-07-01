const { Op, Sequelize } = require('sequelize');
const { Materia, Cuatrimestre } = require('../models');

// Conteo de archivos publicados por materia, calculado con subconsulta correlacionada
// (mismo patrón que los contadores de archivo.repository.js), para no hacer N+1 peticiones.
const ATRIBUTOS_CON_CONTADOR = {
  include: [
    [
      Sequelize.literal(`(SELECT COUNT(*) FROM archivos WHERE archivos.materia_id = "Materia"."id" AND archivos.estado = 'publicado')`),
      'totalArchivos',
    ],
  ],
};

class MateriaRepository {
  async listarTodas(filtro = {}) {
    const where = { activo: true };

    if (filtro.search) {
      where.nombre = { [Op.iLike]: `%${filtro.search}%` };
    }

    const opciones = {
      where,
      attributes: ATRIBUTOS_CON_CONTADOR,
      include: [{ model: Cuatrimestre, as: 'cuatrimestre' }],
      order: [['nombre', 'ASC']],
      subQuery: false,
    };

    if (filtro.limit) {
      opciones.limit = filtro.limit;
    }

    return await Materia.findAll(opciones);
  }

  async listarPorCuatrimestre(cuatrimestreId) {
    return await Materia.findAll({
      where: { cuatrimestreId, activo: true },
      attributes: ATRIBUTOS_CON_CONTADOR,
      subQuery: false,
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