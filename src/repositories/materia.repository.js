const { Op, Sequelize, QueryTypes } = require('sequelize');
const { Materia, Cuatrimestre, sequelize } = require('../models');

class MateriaRepository {
  // VISTA 2 (v_materias_reporte, LEFT JOIN materias-archivos): incluye materias sin
  // ningún archivo todavía, con su conteo real de archivos publicados.
  async listarTodas(filtro = {}) {
    let filtros = '';
    const reemplazos = {};

    if (filtro.search) {
      filtros += ' AND nombre ILIKE :search';
      reemplazos.search = `%${filtro.search}%`;
    }

    let limite = '';
    if (filtro.limit) {
      limite = 'LIMIT :limit';
      reemplazos.limit = filtro.limit;
    }

    return await sequelize.query(
      `SELECT id, nombre, icono, cuatrimestre_id AS "cuatrimestreId", activo, total_archivos AS "totalArchivos"
       FROM v_materias_reporte
       WHERE 1 = 1 ${filtros}
       ORDER BY nombre ASC
       ${limite}`,
      { replacements: reemplazos, type: QueryTypes.SELECT }
    );
  }

  async listarPorCuatrimestre(cuatrimestreId) {
    return await sequelize.query(
      `SELECT id, nombre, icono, cuatrimestre_id AS "cuatrimestreId", activo, total_archivos AS "totalArchivos"
       FROM v_materias_reporte
       WHERE cuatrimestre_id = :cuatrimestreId
       ORDER BY nombre ASC`,
      { replacements: { cuatrimestreId }, type: QueryTypes.SELECT }
    );
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