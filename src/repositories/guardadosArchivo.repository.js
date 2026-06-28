const { GuardadosArchivo, Archivo, Usuario } = require('../models');

class GuardadosArchivoRepository {
  async existe(usuarioId, archivoId) {
    return await GuardadosArchivo.findOne({ where: { usuarioId, archivoId } });
  }

  async crear(usuarioId, archivoId) {
    return await GuardadosArchivo.create({ usuarioId, archivoId });
  }

  async eliminar(usuarioId, archivoId) {
    return await GuardadosArchivo.destroy({ where: { usuarioId, archivoId } });
  }

  async listarPorUsuario(usuarioId, limit = 50, offset = 0) {
    return await GuardadosArchivo.findAll({
      where: { usuarioId },
      include: [
        {
          model: Archivo, as: 'archivo',
          attributes: ['id', 'titulo', 'descripcion', 'estado'],
          include: [
            { model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto'] }
          ]
        }
      ],
      limit,
      offset,
      order: [['creado_en', 'DESC']]
    });
  }

  async contarPorUsuario(usuarioId) {
    return await GuardadosArchivo.count({ where: { usuarioId } });
  }

  async contarPorArchivo(archivoId) {
    return await GuardadosArchivo.count({ where: { archivoId } });
  }
}

module.exports = new GuardadosArchivoRepository();
