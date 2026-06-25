const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ModeracionIA extends Model {}

    ModeracionIA.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        motivoFlag: {
            type: DataTypes.TEXT,
            field: 'motivo_flag'
        },
        aprobado: {
            type: DataTypes.BOOLEAN
        },
        revisadoPor: {
            type: DataTypes.UUID,
            field: 'revisado_por',
            references: {
                model: 'usuarios',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'ModeracionIA',
        tableName: 'moderaciones_ia',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    return ModeracionIA;
};
