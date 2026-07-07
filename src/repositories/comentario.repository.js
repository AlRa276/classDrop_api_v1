const { Sequelize } = require('sequelize');
const { Comentario, Usuario } = require('../models');

// Mismo patrón que ya usa archivo.repository.js: contadores calculados con
// subconsultas correlacionadas en vivo (COUNT(*) real sobre la tabla relacional
// likes_comentarios / dislikes_comentarios), así que NUNCA pueden dar negativo.
// También devolvemos si el usuario actual (usuarioId) ya reaccionó, para que el
// front no tenga que adivinarlo ni guardarlo localmente.
function atributosConReacciones(usuarioId) {
  return {
    include: [
      [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM likes_comentarios WHERE likes_comentarios.comentario_id = "Comentario"."id")`
        ),
        'totalLikes',
      ],
      [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM dislikes_comentarios WHERE dislikes_comentarios.comentario_id = "Comentario"."id")`
        ),
        'totalDislikes',
      ],
      [
        Sequelize.literal(
          `(SELECT EXISTS(SELECT 1 FROM likes_comentarios WHERE likes_comentarios.comentario_id = "Comentario"."id" AND likes_comentarios.usuario_id = :usuarioId))`
        ),
        'isLiked',
      ],
      [
        Sequelize.literal(
          `(SELECT EXISTS(SELECT 1 FROM dislikes_comentarios WHERE dislikes_comentarios.comentario_id = "Comentario"."id" AND dislikes_comentarios.usuario_id = :usuarioId))`
        ),
        'isDisliked',
      ],
    ],
  };
}

class ComentarioRepository {
  async crear(datos) {
    return await Comentario.create(datos);
  }

  async listarPorArchivo(archivoId, usuarioId = null) {
    return await Comentario.findAll({
      // "oculto: false" excluye los comentarios que llegaron a 5 dislikes y
      // están esperando revisión del admin en la cola de reportes.
      where: { archivoId, eliminado: false, oculto: false },
      attributes: atributosConReacciones(usuarioId),
      replacements: { usuarioId },
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

  // El comentario llega al umbral de dislikes: se oculta mientras el admin revisa.
  async marcarOculto(id) {
    const comentario = await Comentario.findByPk(id);
    if (!comentario) return null;
    return await comentario.update({ oculto: true });
  }

  // El admin descarta el reporte: el comentario no tenía ningún problema real.
  async restaurarVisible(id) {
    const comentario = await Comentario.findByPk(id);
    if (!comentario) return null;
    return await comentario.update({ oculto: false });
  }

  // El admin confirma la falta: se borra DEFINITIVAMENTE (a diferencia de
  // marcarEliminado, que solo pone la bandera "eliminado" para un borrado propio).
  async eliminarDefinitivo(id) {
    const comentario = await Comentario.findByPk(id);
    if (!comentario) return null;
    await comentario.destroy();
    return true;
  }

  async contarPorUsuario(usuarioId) {
    return await Comentario.count({ where: { usuarioId, eliminado: true } });
  }
}

module.exports = new ComentarioRepository();