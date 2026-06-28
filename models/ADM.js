const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd'); 

const ADM = sequelize.define('ADM', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    cpf: {
        type: DataTypes.STRING, 
        primaryKey: true 
    }
}, {
    timestamps: false
})