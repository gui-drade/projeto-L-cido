const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd'); 

const ADM = sequelize.define('ADM', {
    cpf: {
        type: DataTypes.STRING(11), 
        allowNull: false, 
        validate: {
            len: [11, 11], 
            isNumeric: true 
        }
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true 
        }
    },
    senha: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: true 
        }
           
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { 
            isEmail: true 
        }
    }
}, {
    tableName: 'adms', 
    timestamps: false
});

module.exports = ADM;