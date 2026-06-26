const {Data_Types} = require('sequelize');
const sequelize = require('../config/bd');
const Item = sequelize.define(
    'Item', {
    nome: {
        type: Data_Types.STRING,
        allowNull: false
    },
    preco: {
        type: Data_Types.FLOAT,
        allowNull: false
    },
    quantidade: {
        type: Data_Types.INTEGER,
        allowNull: false
    },
    categoria: {
        type: Data_Types.STRING,
        allowNull: false
    },
    descricao: {
        type: Data_Types.STRING,
    }},
    {
        tableName: 'Item',
        timestamps: false,
        freezeTableName: true

    }
);

module.exports = Item;