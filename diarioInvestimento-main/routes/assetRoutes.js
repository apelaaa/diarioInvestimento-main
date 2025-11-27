const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', assetController.index);
router.get('/create', assetController.getCreate);
router.post('/create', assetController.postCreate);
router.get('/:id/edit', assetController.getEdit);
router.put('/:id', assetController.putEdit);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
