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
        // ✅ NUEVA COLUMNA: Mapea el código secreto temporal del correo
        twoFactorSecret: {
            type: DataTypes.STRING(6),
            allowNull: true,
            field: 'two_factor_secret' // <-- Con esto Sequelize sabe escribir en tu columna de Railway
        },
        // ✅ NUEVA COLUMNA: Mapea el interruptor que activa el 2FA
        isTwoFactorEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_two_factor_enabled' // <-- Une tu variable con la de Railway
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