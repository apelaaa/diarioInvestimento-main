const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING, // e.g., 'Ação', 'FII', 'Cripto'
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    },
    lastPriceUpdate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    priceChange: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: null
    }
});

module.exports = Asset;
