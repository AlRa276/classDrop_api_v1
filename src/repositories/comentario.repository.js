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
      where: { archivoId, eliminado: false },
      attributes: atributosConReacciones(usuarioId),
      // Sequelize sustituye :usuarioId dentro de los Sequelize.literal de arriba.
      // Si no hay usuario autenticado, usuarioId queda null y las comparaciones
      // "= NULL" simplemente no matchean nada (isLiked/isDisliked quedan false).
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

  async contarPorUsuario(usuarioId) {
    return await Comentario.count({ where: { usuarioId, eliminado: true } });
  }
}

module.exports = new ComentarioRepository();