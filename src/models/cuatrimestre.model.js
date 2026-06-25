const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Cuatrimestre extends Model {}
    Cuatrimestre.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Cuatrimestre',
        tableName: 'cuatrimestres',
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
    return Cuatrimestre;
}