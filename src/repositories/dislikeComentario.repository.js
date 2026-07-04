const { DislikesComentario } = require('../models');

class DislikeComentarioRepository {
  async existe(usuarioId, comentarioId) {
    return await DislikesComentario.findOne({ where: { usuarioId, comentarioId } });
  }

  async crear(usuarioId, comentarioId) {
    return await DislikesComentario.create({ usuarioId, comentarioId });
  }

  async eliminar(usuarioId, comentarioId) {
    return await DislikesComentario.destroy({ where: { usuarioId, comentarioId } });
  }

  async contarPorComentario(comentarioId) {
    return await DislikesComentario.count({ where: { comentarioId } });
  }
}

module.exports = new DislikeComentarioRepository();