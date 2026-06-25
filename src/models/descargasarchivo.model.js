const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class DescargasArchivo extends Model {}

    DescargasArchivo.init({
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
        archivoId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'archivo_id',
            references: {
                model: 'archivos',
                key: 'id'
            }
        },
        adjuntoId: {
            type: DataTypes.UUID,
            field: 'adjunto_id',
            references: {
                model: 'archivos_adjuntos',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'DescargasArchivo',
        tableName: 'descargas_archivos',
        timestamps: true,
        createdAt: 'descargado_en',
        updatedAt: false
    });

    return DescargasArchivo;
};
