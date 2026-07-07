const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Comentario extends Model {}

    Comentario.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        contenido: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        archivoId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'archivo_id',
            references: {
                model: 'archivos',
                key: 'id'
            }
        },
        usuarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'usuario_id',
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        eliminado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        oculto: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Comentario',
        tableName: 'comentarios',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false,
        indexes: [
            { fields: ['archivo_id'] }
        ]
    });

    Comentario.associate = (models) => {
        Comentario.belongsTo(models.Usuario, {
            foreignKey: 'usuarioId',
            as: 'autor'
        });
    };

    return Comentario;
};