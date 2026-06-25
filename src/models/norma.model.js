const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Norma extends Model {}

    Norma.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        icono: {
            type: DataTypes.STRING(50)
        },
        estado: {
            type: DataTypes.ENUM('activa', 'inactiva'),
            defaultValue: 'activa'
        }
    }, {
        sequelize,
        modelName: 'Norma',
        tableName: 'normas',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: 'actualizado_en'
    });

    return Norma;
};
