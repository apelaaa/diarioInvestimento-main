const axios = require('axios');

class PriceService {
    constructor() {
        // Mapeamento de símbolos de cripto para IDs do CoinGecko
        this.cryptoMap = {
            'BTC': 'bitcoin',
            'BITCOIN': 'bitcoin',
            'ETH': 'ethereum',
            'ETHEREUM': 'ethereum',
            'USDT': 'tether',
            'BNB': 'binancecoin',
            'SOL': 'solana',
            'ADA': 'cardano',
            'XRP': 'ripple',
            'DOT': 'polkadot',
            'DOGE': 'dogecoin',
            'MATIC': 'matic-network',
            'AVAX': 'avalanche-2',
            'LINK': 'chainlink'
        };
    }

    /**
     * Busca o preço de uma ação ou FII brasileiro via Brapi
     */
    async fetchBrapiPrice(symbol) {
        try {
            const url = `https://brapi.dev/api/quote/${symbol}`;
            const response = await axios.get(url, { timeout: 5000 });
            
            if (response.data && response.data.results && response.data.results.length > 0) {
                const result = response.data.results[0];
                return {
                    price: result.regularMarketPrice,
                    change: result.regularMarketChangePercent,
                    success: true
                };
            }
            
            return { success: false, error: 'Símbolo não encontrado' };
        } catch (error) {
            console.error(`Erro ao buscar preço para ${symbol}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Busca o preço de uma criptomoeda via CoinGecko
     */
    async fetchCryptoPrice(symbol) {
        try {
            // Converte o símbolo para o ID do CoinGecko
            const symbolUpper = symbol.toUpperCase();
            const coinId = this.cryptoMap[symbolUpper];
            
            if (!coinId) {
                return { success: false, error: 'Criptomoeda não suportada' };
            }

            const url = `https://api.coingecko.com/api/v3/simple/price`;
            const params = {
                ids: coinId,
                vs_currencies: 'brl',
                include_24hr_change: true
            };
            
            const response = await axios.get(url, { params, timeout: 5000 });
            
            if (response.data && response.data[coinId]) {
                const data = response.data[coinId];
                return {
                    price: data.brl,
                    change: data.brl_24h_change || 0,
                    success: true
                };
            }
            
            return { success: false, error: 'Criptomoeda não encontrada' };
        } catch (error) {
            console.error(`Erro ao buscar preço cripto para ${symbol}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Busca o preço de um ativo baseado no tipo
     */
    async fetchPrice(asset) {
        switch (asset.type) {
            case 'Ação':
            case 'FII':
                return await this.fetchBrapiPrice(asset.symbol);
            case 'Cripto':
                return await this.fetchCryptoPrice(asset.symbol);
            default:
                // Renda Fixa e outros não têm preço de mercado
                return { success: false, error: 'Tipo de ativo não suporta preço de mercado' };
        }
    }

    /**
     * Atualiza o preço de um ativo específico
     */
    async updateAssetPrice(asset) {
        const priceData = await this.fetchPrice(asset);
        
        if (priceData.success) {
            asset.currentPrice = priceData.price;
            asset.priceChange = priceData.change;
            asset.lastPriceUpdate = new Date();
            await asset.save();
            return { success: true, price: priceData.price };
        }
        
        return { success: false, error: priceData.error };
    }

    /**
     * Atualiza os preços de múltiplos ativos
     */
    async updateMultipleAssetPrices(assets) {
        const results = [];
        
        for (const asset of assets) {
            // Só atualiza ativos que têm preço de mercado
            if (['Ação', 'FII', 'Cripto'].includes(asset.type)) {
                const result = await this.updateAssetPrice(asset);
                results.push({
                    assetId: asset.id,
                    symbol: asset.symbol,
                    ...result
                });
                
                // Pequeno delay para respeitar rate limits
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        return results;
    }

    /**
     * Verifica se o preço precisa ser atualizado (mais de 5 minutos)
     */
    needsUpdate(asset) {
        if (!asset.lastPriceUpdate) return true;
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return asset.lastPriceUpdate < fiveMinutesAgo;
    }
}

module.exports = new PriceService();
