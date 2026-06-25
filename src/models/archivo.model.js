const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Archivo extends Model {}

    Archivo.init({
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
            type: DataTypes.TEXT
        },
        tipo: {
            type: DataTypes.ENUM('pdf', 'docx', 'url', 'otro'),
            defaultValue: 'pdf'
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'escaneando', 'revision_calidad', 'publicado', 'rechazado'),
            defaultValue: 'pendiente'
        },
        motivoRechazo: {
            type: DataTypes.TEXT,
            field: 'motivo_rechazo'
        },
        subidoPor: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'subido_por',
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        materiaId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'materia_id',
            references: {
                model: 'materias',
                key: 'id'
            }
        },
        publicadoEn: {
            type: DataTypes.DATE,
            field: 'publicado_en'
        }
    }, {
        sequelize,
        modelName: 'Archivo',
        tableName: 'archivos',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false,
        indexes: [
            { fields: ['materia_id'] },
            { fields: ['estado'] },
            { fields: ['subido_por'] }
        ]
    });

    return Archivo;
};
