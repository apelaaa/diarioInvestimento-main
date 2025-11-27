const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', transactionController.index);
router.get('/create', transactionController.getCreate);
router.post('/create', transactionController.postCreate);
router.get('/:id/edit', transactionController.getEdit);
router.put('/:id', transactionController.putEdit);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
