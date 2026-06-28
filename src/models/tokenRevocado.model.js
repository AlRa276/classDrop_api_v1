const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class TokenRevocado extends Model {}

    TokenRevocado.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        tokenHash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
            field: 'token_hash'
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
        expiraEn: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'expira_en'
        }
    }, {
        sequelize,
        modelName: 'TokenRevocado',
        tableName: 'tokens_revocados',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: false,
        indexes: [
            { fields: ['expira_en'] }
        ]
    });

    TokenRevocado.associate = (db) => {
        TokenRevocado.belongsTo(db.Usuario, {
            as: 'usuario',
            foreignKey: 'usuarioId'
        });
    };

    return TokenRevocado;
};