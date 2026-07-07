const { Reporte, Archivo, Comentario, Usuario, ArchivoAdjunto } = require('../models');

class ReporteRepository {
  async crear(datos) {
    return await Reporte.create(datos);
  }

  async buscarPorId(id) {
    return await Reporte.findByPk(id);
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

  // Trae el contenido completo (archivo o comentario, con su autor) para que
  // la pantalla de admin pueda mostrar todo sin pedirlo aparte.
  async listarPendientes() {
    return await Reporte.findAll({
      where: { estado: 'pendiente' },
      include: [
        { model: Usuario, as: 'reportador', attributes: ['id', 'nombreCompleto'] },
        {
          model: Archivo,
          as: 'archivo',
          include: [
            { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] },
            { model: ArchivoAdjunto, as: 'adjuntos' },
          ],
        },
        {
          model: Comentario,
          as: 'comentario',
          include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] }],
        },
      ],
      order: [['creado_en', 'ASC']],
    });
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