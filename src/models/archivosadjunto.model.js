const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ArchivoAdjunto extends Model {}

    ArchivoAdjunto.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        urlStorage: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'url_storage'
        },
        nombreOriginal: {
            type: DataTypes.STRING(255),
            field: 'nombre_original'
        },
        tipoMime: {
            type: DataTypes.STRING(100),
            field: 'tipo_mime'
        },
        tamanoByes: {
            type: DataTypes.BIGINT,
            field: 'tamano_bytes'
        },
        numPaginas: {
            type: DataTypes.SMALLINT,
            field: 'num_paginas'
        },
        orden: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'ArchivoAdjunto',
        tableName: 'archivos_adjuntos',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false,
        indexes: [
            { fields: ['archivo_id'] }
        ]
    });

    ArchivoAdjunto.associate = (db) => {
        ArchivoAdjunto.belongsTo(db.Archivo, {
            as: 'adjuntos',
            foreignKey: 'archivoId'
        });
    }

    return ArchivoAdjunto;
};
