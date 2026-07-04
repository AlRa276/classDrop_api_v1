const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class DislikesComentario extends Model {}

    DislikesComentario.init({
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
        modelName: 'DislikesComentario',
        tableName: 'dislikes_comentarios',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    DislikesComentario.associate = (db) => {
        DislikesComentario.belongsTo(db.Usuario, {
            as: 'usuario',
            foreignKey: 'usuarioId'
        });
        DislikesComentario.belongsTo(db.Comentario, {
            as: 'comentario',
            foreignKey: 'comentarioId'
        });
    };

    return DislikesComentario;
};