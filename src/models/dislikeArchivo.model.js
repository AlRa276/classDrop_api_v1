const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class DislikesArchivo extends Model {}

    DislikesArchivo.init({
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
        modelName: 'DislikesArchivo',
        tableName: 'dislikes_archivos',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false
    });

    DislikesArchivo.associate = (db) => {
        DislikesArchivo.belongsTo(db.Usuario, {
            as: 'usuario',
            foreignKey: 'usuarioId'
        });
        DislikesArchivo.belongsTo(db.Archivo, {
            as: 'archivo',
            foreignKey: 'archivoId'
        });
    };

    return DislikesArchivo;
};