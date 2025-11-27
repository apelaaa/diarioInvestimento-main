const { User, Asset, Transaction } = require('./models');
const sequelize = require('./config/database');

async function verify() {
    try {
        await sequelize.sync({ force: true }); // Reset DB
        console.log('Database synced.');

        // 1. Create User
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('User created:', user.toJSON());

        // 2. Create Asset
        const asset = await Asset.create({
            name: 'Petrobras',
            symbol: 'PETR4',
            type: 'Ação',
            userId: user.id
        });
        console.log('Asset created:', asset.toJSON());

        // 3. Create Transaction
        const transaction = await Transaction.create({
            type: 'Compra',
            quantity: 100,
            price: 30.50,
            date: '2023-10-27',
            assetId: asset.id,
            userId: user.id
        });
        console.log('Transaction created:', transaction.toJSON());

        // 4. Verify Relationships
        const userWithData = await User.findOne({
            where: { id: user.id },
            include: [Asset, Transaction]
        });
        console.log('User with data:', JSON.stringify(userWithData, null, 2));

        if (userWithData.Assets.length === 1 && userWithData.Transactions.length === 1) {
            console.log('VERIFICATION SUCCESS: All relationships working.');
        } else {
            console.error('VERIFICATION FAILED: Relationships missing.');
        }

    } catch (error) {
        console.error('Verification Error:', error);
    } finally {
        await sequelize.close();
    }
}

verify();
