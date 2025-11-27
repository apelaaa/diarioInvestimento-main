const User = require('./User');
const Asset = require('./Asset');
const Transaction = require('./Transaction');

// Associations
User.hasMany(Asset, { foreignKey: 'userId', onDelete: 'CASCADE' });
Asset.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Asset.hasMany(Transaction, { foreignKey: 'assetId', onDelete: 'CASCADE' });
Transaction.belongsTo(Asset, { foreignKey: 'assetId' });

module.exports = {
    User,
    Asset,
    Transaction
};
