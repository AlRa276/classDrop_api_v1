const { Reporte } = require('../models');

class ReporteRepository {
  async crear(datos) {
    return await Reporte.create(datos);
  }

  async contarPorArchivo(archivoId) {
    return await Reporte.count({
      where: { archivoId, estado: 'pendiente' },
    });
  }

  async contarPorComentario(comentarioId) {
    return await Reporte.count({
      where: { comentarioId, estado: 'pendiente' },
    });
  }

  async listarPendientes() {
    return await Reporte.findAll({ where: { estado: 'pendiente' } });
  }

  async actualizarEstado(id, estado, resueltoPor, accionTomada) {
    const reporte = await Reporte.findByPk(id);
    if (!reporte) return null;
    return await reporte.update({
      estado,
      resueltoPor,
      accionTomada,
      resueltoEn: new Date(),
    });
  }

  async yaReportadoPorUsuario(usuarioId, archivoId, comentarioId) {
    const where = { reportadoPor: usuarioId };
    if (archivoId) where.archivoId = archivoId;
    if (comentarioId) where.comentarioId = comentarioId;
    return await Reporte.findOne({ where });
  }
}

module.exports = new ReporteRepository();