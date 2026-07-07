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

  // Se usa cuando el admin restaura un comentario (reporte descartado): le da
  // un "borrón y cuenta nueva" para que no se vuelva a ocultar solo de inmediato.
  async eliminarTodosPorComentario(comentarioId) {
    return await DislikesComentario.destroy({ where: { comentarioId } });
  }
}

module.exports = new DislikeComentarioRepository();