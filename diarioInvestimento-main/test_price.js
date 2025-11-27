const priceService = require('./services/priceService');

async function testPrice() {
    console.log('Fetching prices for PETR4.SA and BTC-USD...');
    const prices = await priceService.getCurrentPrices(['PETR4.SA', 'BTC-USD']);
    console.log('Prices:', prices);
}

testPrice();
