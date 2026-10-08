const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Estudante = sequelize.define(
    'Estudante',
    {
        nome: {
            type: DataTypes.STRING,
        },
        idade: {
            type: DataTypes.INTEGER,
        },
        escola: {
            type: DataTypes.STRING,
        }
    },
    {
        tableName: 'Estudantes',
        timestamps: true
    }
);

module.exports = Estudante;