const priceService = require('./services/priceService');

async function test() {
    console.log('Testing price service...');
    try {
        const prices = await priceService.getCurrentPrices(['PETR4', 'PETR4.SA', 'BTC-USD']);
        console.log('Prices:', prices);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
