const { Comentario, Usuario } = require('../models');

class ComentarioRepository {
  async crear(datos) {
    return await Comentario.create(datos);
  }

  async listarPorArchivo(archivoId) {
    return await Comentario.findAll({
      where: { archivoId, eliminado: false },
      include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nombreCompleto', 'avatarUrl'] }],
      order: [['creado_en', 'ASC']],
    });
  }

  async buscarPorId(id) {
    return await Comentario.findByPk(id);
  }

  async marcarEliminado(id) {
    const comentario = await Comentario.findByPk(id);
    if (!comentario) return null;
    return await comentario.update({ eliminado: true });
  }

  async contarPorUsuario(usuarioId) {
    return await Comentario.count({ where: { usuarioId, eliminado: true } });
  }
}

module.exports = new ComentarioRepository();