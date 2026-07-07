// src/models/usuario.js
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
        fcmToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'fcm_token'
        },
        // ✉️ Mapea el código de 6 dígitos que se manda al correo para iniciar sesión
        twoFactorSecret: {
            type: DataTypes.STRING(6),
            allowNull: true,
            field: 'two_factor_secret'
        },
        // 🔑 NUEVA COLUMNA ESENCIAL: Mapea el token de confianza que dura 30 días en el celular
        rememberToken: {
            type: DataTypes.TEXT, // Usamos TEXT porque los JWT de 30 días son cadenas muy largas
            allowNull: true,
            field: 'remember_token'
        },
        // 🔒 Recuperación de contraseña: Código temporal de 6 dígitos
        tokenRecuperacion: {
            type: DataTypes.STRING(6),
            allowNull: true,
            field: 'token_recuperacion'
        },
        // ⏳ Recuperación de contraseña: Fecha y hora en la que expira el código
        tokenRecuperacionExpira: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'token_recuperacion_expira'
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