const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.getRegister = (req, res) => {
    res.render('auth/register', { user: req.session.user || null, error: null });
};

exports.postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            return res.render('auth/register', { user: req.session.user || null, error: 'Preencha todos os campos.' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('auth/register', { user: req.session.user || null, error: 'Email já cadastrado.' });
        }

        await User.create({ name, email, password });
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.render('auth/register', { user: req.session.user || null, error: 'Erro ao registrar usuário.' });
    }
};

exports.getLogin = (req, res) => {
    res.render('auth/login', { user: req.session.user || null, error: null });
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.render('auth/login', { user: req.session.user || null, error: 'Credenciais inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', { user: req.session.user || null, error: 'Credenciais inválidas.' });
        }

        // Set session
        req.session.user = { id: user.id, name: user.name, email: user.email };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('auth/login', { user: req.session.user || null, error: 'Erro ao fazer login.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

exports.getProfile = (req, res) => {
    res.render('auth/profile', { user: req.session.user, error: null, success: null });
};

exports.postProfile = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const userId = req.session.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.redirect('/auth/login');
        }

        // Update basic info
        user.name = name;
        user.email = email;

        // Update password if provided
        if (password) {
            if (password !== confirmPassword) {
                return res.render('auth/profile', { user: req.session.user, error: 'As senhas não conferem.', success: null });
            }
            // Hook in model will hash it
            user.password = password;
        }

        await user.save();

        // Update session
        req.session.user = { id: user.id, name: user.name, email: user.email };

        res.render('auth/profile', { user: req.session.user, error: null, success: 'Perfil atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.render('auth/profile', { user: req.session.user, error: 'Erro ao atualizar perfil.', success: null });
    }
};
