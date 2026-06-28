const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');
const Item = sequelize.define(
    'Item', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
    }},
    {
        tableName: 'Item',
        timestamps: false,
        freezeTableName: true

    }
);

module.exports = Item;