const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class LikesArchivo extends Model {}

    LikesArchivo.init({
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
        archivoId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'archivo_id',
            references: {
                model: 'archivos',
                key: 'id'
            },
            primaryKey: true
        }
    }, {
        sequelize,
        modelName: 'LikesArchivo',
        tableName: 'likes_archivos',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    return LikesArchivo;
};
