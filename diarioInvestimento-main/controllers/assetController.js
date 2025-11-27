const { Asset, Transaction } = require('../models');
const priceService = require('../services/priceService');

exports.index = async (req, res) => {
    try {
        const assets = await Asset.findAll({ 
            where: { userId: req.session.user.id },
            include: [{ model: Transaction }]
        });

        // Auto-sync prices for assets that need update (> 5 minutes old)
        for (const asset of assets) {
            if (['Ação', 'FII', 'Cripto'].includes(asset.type) && priceService.needsUpdate(asset)) {
                await priceService.updateAssetPrice(asset);
            }
        }

        // Calculate values with current prices
        const assetsWithData = assets.map(asset => {
            // Calculate total quantity and cost from transactions
            let quantity = 0;
            let totalCost = 0;

            asset.Transactions.forEach(t => {
                if (t.type === 'Compra') {
                    quantity += t.quantity;
                    totalCost += Number(t.price) * t.quantity;
                } else {
                    quantity -= t.quantity;
                    // For sales, reduce cost proportionally
                    if (quantity > 0) {
                        const avgCost = totalCost / (quantity + t.quantity);
                        totalCost -= avgCost * t.quantity;
                    }
                }
            });

            // Calculate current value and profit/loss
            const currentPrice = asset.currentPrice ? Number(asset.currentPrice) : (totalCost / quantity || 0);
            const currentValue = (Number(quantity) * Number(currentPrice)) || 0;
            const profitLoss = currentValue - totalCost;
            const profitLossPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

            return {
                ...asset.toJSON(),
                currentPrice: Number(currentPrice) || 0,
                quantity: Number(quantity) || 0,
                totalCost: Number(totalCost) || 0,
                currentValue: Number(currentValue) || 0,
                profitLoss: Number(profitLoss) || 0,
                profitLossPct: Number(profitLossPct) || 0
            };
        });

        res.render('assets/index', { assets: assetsWithData, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar ativos.');
    }
};

exports.getCreate = (req, res) => {
    res.render('assets/create', { user: req.session.user, error: null });
};

exports.postCreate = async (req, res) => {
    try {
        const { name, symbol, type } = req.body;
        await Asset.create({
            name,
            symbol,
            type,
            userId: req.session.user.id
        });
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        res.render('assets/create', { user: req.session.user, error: 'Erro ao criar ativo.' });
    }
};

exports.getEdit = async (req, res) => {
    try {
        const asset = await Asset.findOne({ where: { id: req.params.id, userId: req.session.user.id } });
        if (!asset) {
            return res.redirect('/assets');
        }
        res.render('assets/edit', { asset, user: req.session.user, error: null });
    } catch (error) {
        console.error(error);
        res.redirect('/assets');
    }
};

exports.putEdit = async (req, res) => {
    try {
        const { name, symbol, type } = req.body;
        await Asset.update({ name, symbol, type }, {
            where: { id: req.params.id, userId: req.session.user.id }
        });
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        res.render('assets/edit', { asset: { ...req.body, id: req.params.id }, user: req.session.user, error: 'Erro ao atualizar ativo.' });
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        await Asset.destroy({ where: { id: req.params.id, userId: req.session.user.id } });
        res.redirect('/assets');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir ativo.');
    }
};
