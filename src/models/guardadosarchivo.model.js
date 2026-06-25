const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class GuardadosArchivo extends Model {}

    GuardadosArchivo.init({
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
        modelName: 'GuardadosArchivo',
        tableName: 'guardados_archivos',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    return GuardadosArchivo;
};
