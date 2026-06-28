const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Politica extends Model {}

    Politica.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        categoria: {
            type: DataTypes.ENUM('privacidad', 'seguridad', 'reglamento_interno', 'terminos_uso', 'general'),
            allowNull: false,
            defaultValue: 'general'
        },
        titulo: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        contenido: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        icono: {
            type: DataTypes.STRING(50)
        },
        esPrincipal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'es_principal'
        },
        orden: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Politica',
        tableName: 'politicas',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: 'actualizado_en',
        indexes: [
            { fields: ['categoria'] }
        ]
    });

    return Politica;
};