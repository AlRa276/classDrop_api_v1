const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Reporte extends Model {}

    Reporte.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        reportadoPor: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'reportado_por',
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        tipoContenido: {
            type: DataTypes.ENUM('archivo', 'comentario'),
            allowNull: false,
            field: 'tipo_contenido'
        },
        archivoId: {
            type: DataTypes.UUID,
            field: 'archivo_id',
            references: {
                model: 'archivos',
                key: 'id'
            }
        },
        comentarioId: {
            type: DataTypes.UUID,
            field: 'comentario_id',
            references: {
                model: 'comentarios',
                key: 'id'
            }
        },
        puntuacion: {
            type: DataTypes.SMALLINT
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'resuelto', 'descartado'),
            defaultValue: 'pendiente'
        },
        resoltoPor: {
            type: DataTypes.UUID,
            field: 'resuelto_por',
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        accionTomada: {
            type: DataTypes.TEXT,
            field: 'accion_tomada'
        },
        resueltoEn: {
            type: DataTypes.DATE,
            field: 'resuelto_en'
        }
    }, {
        sequelize,
        modelName: 'Reporte',
        tableName: 'reportes',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false,
        indexes: [
            { fields: ['estado'] }
        ]
    });

    return Reporte;
};
