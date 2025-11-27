const { Asset, Transaction, User } = require('./models');
const priceService = require('./services/priceService');
const sequelize = require('./config/database');

async function reproduce() {
    try {
        // Mock session user
        const userId = 1;

        const assets = await Asset.findAll({ 
            where: { userId },
            include: [{ model: Transaction }]
        });

        // Get symbols
        const symbols = assets.map(a => a.symbol);
        console.log('Symbols:', symbols);
        
        const prices = await priceService.getCurrentPrices(symbols);
        console.log('Prices:', prices);

        // Calculate values
        const assetsWithData = assets.map(asset => {
            const currentPrice = prices[asset.symbol] || 0;
            
            let quantity = 0;
            let totalCost = 0;

            asset.Transactions.forEach(t => {
                if (t.type === 'Compra') {
                    quantity += t.quantity;
                    totalCost += Number(t.price) * t.quantity;
                } else {
                    quantity -= t.quantity;
                    if (quantity > 0) {
                         const avgCost = totalCost / (quantity + t.quantity);
                         totalCost -= avgCost * t.quantity;
                    }
                }
            });

            const currentValue = quantity * currentPrice;
            const profitLoss = currentValue - totalCost;
            const profitLossPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

            return {
                ...asset.toJSON(),
                currentPrice,
                quantity,
                totalCost,
                currentValue,
                profitLoss,
                profitLossPct
            };
        });

        console.log('Assets Data:', JSON.stringify(assetsWithData, null, 2));

        // Check for undefined currentValue
        assetsWithData.forEach(a => {
            if (a.currentValue === undefined) {
                console.error('ERROR: currentValue is undefined for asset', a.symbol);
            } else {
                console.log(`Asset ${a.symbol}: currentValue = ${a.currentValue}`);
            }
        });

    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

reproduce();
