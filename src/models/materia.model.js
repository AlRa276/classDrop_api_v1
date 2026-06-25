const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Materia extends Model {}

    Materia.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        icono: {
            type: DataTypes.STRING(50)
        },
        cuatrimestreId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            field: 'cuatrimestre_id',
            references: {
                model: 'cuatrimestres',
                key: 'id'
            }
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Materia',
        tableName: 'materias',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['nombre', 'cuatrimestre_id']
            }
        ]
    });

    return Materia;
};
