const { Transaction, Asset } = require('../models');

exports.index = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId: req.session.user.id },
            include: [{ model: Asset, attributes: ['name', 'symbol'] }],
            order: [['date', 'DESC']]
        });
        res.render('transactions/index', { transactions, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar transações.');
    }
};

exports.getCreate = async (req, res) => {
    try {
        const assets = await Asset.findAll({ where: { userId: req.session.user.id } });
        res.render('transactions/create', { assets, user: req.session.user, error: null });
    } catch (error) {
        console.error(error);
        res.redirect('/transactions');
    }
};

exports.postCreate = async (req, res) => {
    try {
        const { assetId, type, quantity, price, date } = req.body;
        await Transaction.create({
            assetId,
            type,
            quantity,
            price,
            date,
            userId: req.session.user.id
        });
        res.redirect('/transactions');
    } catch (error) {
        console.error(error);
        const assets = await Asset.findAll({ where: { userId: req.session.user.id } });
        res.render('transactions/create', { assets, user: req.session.user, error: 'Erro ao criar transação.' });
    }
};

exports.getEdit = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.session.user.id } });
        const assets = await Asset.findAll({ where: { userId: req.session.user.id } });
        
        if (!transaction) {
            return res.redirect('/transactions');
        }
        res.render('transactions/edit', { transaction, assets, user: req.session.user, error: null });
    } catch (error) {
        console.error(error);
        res.redirect('/transactions');
    }
};

exports.putEdit = async (req, res) => {
    try {
        const { assetId, type, quantity, price, date } = req.body;
        await Transaction.update({ assetId, type, quantity, price, date }, {
            where: { id: req.params.id, userId: req.session.user.id }
        });
        res.redirect('/transactions');
    } catch (error) {
        console.error(error);
        const assets = await Asset.findAll({ where: { userId: req.session.user.id } });
        res.render('transactions/edit', { 
            transaction: { ...req.body, id: req.params.id }, 
            assets, 
            user: req.session.user, 
            error: 'Erro ao atualizar transação.' 
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.destroy({ where: { id: req.params.id, userId: req.session.user.id } });
        res.redirect('/transactions');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir transação.');
    }
};
