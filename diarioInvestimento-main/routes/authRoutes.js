const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.get('/profile', (req, res, next) => {
    if (!req.session.user) return res.redirect('/auth/login');
    next();
}, authController.getProfile);
router.post('/profile', (req, res, next) => {
    if (!req.session.user) return res.redirect('/auth/login');
    next();
}, authController.postProfile);

module.exports = router;
