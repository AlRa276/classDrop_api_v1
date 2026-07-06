const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Usuario extends Model {}

    Usuario.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nombreCompleto: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: 'nombre_completo'
        },
        correo: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        contrasenaHash: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'contrasena_hash'
        },
        rol: {
            type: DataTypes.ENUM('estudiante', 'admin'),
            defaultValue: 'estudiante'
        },
        avatarUrl: {
            type: DataTypes.TEXT,
            field: 'avatar_url'
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        fmcToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'fmc_token'
        }

    }, {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    return Usuario;
};