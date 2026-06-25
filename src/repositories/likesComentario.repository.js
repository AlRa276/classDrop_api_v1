const { LikesComentario, Comentario, Usuario } = require('../models');

class LikesComentarioRepository {
  async existe(usuarioId, comentarioId) {
    return await LikesComentario.findOne({ where: { usuarioId, comentarioId } });
  }

  async crear(usuarioId, comentarioId) {
    return await LikesComentario.create({ usuarioId, comentarioId });
  }

  async eliminar(usuarioId, comentarioId) {
    return await LikesComentario.destroy({ where: { usuarioId, comentarioId } });
  }

  async contarPorComentario(comentarioId) {
    return await LikesComentario.count({ where: { comentarioId } });
  }

  async listarPorComentario(comentarioId) {
    return await LikesComentario.findAll({
      where: { comentarioId },
      include: [
        { model: Usuario, attributes: ['id', 'nombreCompleto', 'avatarUrl'] }
      ]
    });
  }
}

module.exports = new LikesComentarioRepository();
