const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Notificacion extends Model {}

    Notificacion.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        titulo: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        cuerpo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // 'info' | 'exito' | 'error' | 'advertencia' — el front lo usa para
        // elegir el ícono/color de la notificación.
        tipo: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'info'
        },
        // Opcional: si la notificación se refiere a un archivo, guardamos su id
        // para poder navegar directo a él al tocar la notificación.
        archivoId: {
            type: DataTypes.UUID,
            field: 'archivo_id',
            references: {
                model: 'archivos',
                key: 'id'
            }
        },
        leida: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Notificacion',
        tableName: 'notificaciones',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false,
        indexes: [
            { fields: ['usuario_id'] },
            { fields: ['usuario_id', 'leida'] }
        ]
    });

    Notificacion.associate = (db) => {
        Notificacion.belongsTo(db.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
        Notificacion.belongsTo(db.Archivo, { foreignKey: 'archivoId', as: 'archivo' });
    };

    return Notificacion;
};