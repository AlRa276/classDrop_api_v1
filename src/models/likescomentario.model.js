const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class LikesComentario extends Model {}

    LikesComentario.init({
        usuarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'usuario_id',
            references: {
                model: 'usuarios',
                key: 'id'
            },
            primaryKey: true
        },
        comentarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'comentario_id',
            references: {
                model: 'comentarios',
                key: 'id'
            },
            primaryKey: true
        }
    }, {
        sequelize,
        modelName: 'LikesComentario',
        tableName: 'likes_comentarios',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    return LikesComentario;
};
