const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const sequelize = require('./config/database');
const { User, Asset, Transaction } = require('./models');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session Config
app.use(session({
    secret: 'secret_key_change_this', // In production use .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/auth', authRoutes);
app.use('/assets', assetRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.render('dashboard', { user: null, portfolioData: null });
        }

        const priceService = require('./services/priceService');
        
        // Fetch user's assets with transactions
        const assets = await Asset.findAll({
            where: { userId: req.session.user.id },
            include: [{ model: Transaction }]
        });

        // Auto-sync prices
        for (const asset of assets) {
            if (['Ação', 'FII', 'Cripto'].includes(asset.type) && priceService.needsUpdate(asset)) {
                await priceService.updateAssetPrice(asset);
            }
        }

        // Calculate portfolio totals
        let totalInvested = 0;
        let totalCurrentValue = 0;

        assets.forEach(asset => {
            let quantity = 0;
            let cost = 0;

            asset.Transactions.forEach(t => {
                if (t.type === 'Compra') {
                    quantity += t.quantity;
                    cost += Number(t.price) * t.quantity;
                } else {
                    quantity -= t.quantity;
                    if (quantity > 0) {
                        const avgCost = cost / (quantity + t.quantity);
                        cost -= avgCost * t.quantity;
                    }
                }
            });

            totalInvested += cost;
            
            const currentPrice = asset.currentPrice ? Number(asset.currentPrice) : (cost / quantity || 0);
            totalCurrentValue += quantity * currentPrice;
        });

        const profitLoss = totalCurrentValue - totalInvested;
        const profitLossPct = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

        const portfolioData = {
            totalInvested: totalInvested.toFixed(2),
            totalCurrentValue: totalCurrentValue.toFixed(2),
            profitLoss: profitLoss.toFixed(2),
            profitLossPct: profitLossPct.toFixed(2)
        };

        res.render('dashboard', { user: req.session.user, portfolioData });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('dashboard', { user: req.session.user || null, portfolioData: null });
    }
});

// Database Sync & Server Start
const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
