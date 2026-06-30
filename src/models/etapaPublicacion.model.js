const { Model, DataTypes } = require('sequelize');

const ETAPAS = [
  { valor: 'archivo_recibido',   orden: 1, label: 'Archivo Recibido' },
  { valor: 'escaneo_seguridad',  orden: 2, label: 'Escaneo de Seguridad' },
  { valor: 'revision_calidad',   orden: 3, label: 'Revisión de Calidad' },
  { valor: 'publicacion',        orden: 4, label: 'Publicación' },
];

module.exports = (sequelize) => {
    class EtapaPublicacion extends Model {}

    EtapaPublicacion.init({
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        archivoId: { 
            type: DataTypes.UUID, 
            allowNull: false, field: 'archivo_id', 
            references: { 
                model: 'archivos', 
                key: 'id' 
            } 
        },
        etapa: {
            type: DataTypes.ENUM('archivo_recibido', 'escaneo_seguridad', 'revision_calidad', 'publicacion'),
            allowNull: false
        },
        orden: { 
            type: DataTypes.SMALLINT, 
            allowNull: false 
        },
        completado: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: false 
        },
        progreso: { 
            type: DataTypes.SMALLINT, 
            allowNull: true 
        },
        actualizadoEn: { 
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: DataTypes.NOW, 
            field: 'actualizado_en' 
        }
    }, {
        sequelize,
        modelName: 'EtapaPublicacion',
        tableName: 'etapas_publicacion',
        timestamps: false
    });

    EtapaPublicacion.associate = (db) => {
        EtapaPublicacion.belongsTo(db.Archivo, { 
            foreignKey: 'archivoId', 
            as: 'archivo' 
        });
    };

    return EtapaPublicacion;
};

module.exports.ETAPAS = ETAPAS;