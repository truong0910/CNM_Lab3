const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { requireLogin, requireRole } = require('../middlewares/auth.middleware');

router.use(requireLogin);

router.get('/', ProductController.index);

// Admin only
router.get('/add', requireRole('admin'), ProductController.showAddForm);
router.post('/', requireRole('admin'), ProductController.create);

router.get('/:id/edit', requireRole('admin'), ProductController.showEditForm);
router.post('/:id/update', requireRole('admin'), ProductController.update);

router.get('/:id/delete', requireRole('admin'), ProductController.delete);

module.exports = router;