const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const { requireLogin, requireRole } = require('../middlewares/auth.middleware');

// Apply login check to all routes
router.use(requireLogin);

router.get('/', CategoryController.index);

// Admin only routes
router.get('/add', requireRole('admin'), CategoryController.showAddForm);
router.post('/', requireRole('admin'), CategoryController.create);
router.get('/:id/edit', requireRole('admin'), CategoryController.showEditForm);
router.post('/:id', requireRole('admin'), CategoryController.update); // Using POST for update form action often used in simple MVC without method-override, or we can use specific route like /:id/update
// Express often uses method-override or just POST to same URL or specific action URL. 
// Standard REST uses PUT/PATCH but HTML forms only support GET/POST.
// Let's assume using POST to /:id for update works if logic handles it, or use /:id/update to be safe.
// Checking Controller: update uses `req.params.id`.
// I will use `post('/:id/update')` or just `post('/:id')` if it doesn't conflict. 
// `delete` usually needs a POST to /:id/delete or client-side JS.
router.post('/:id/update', requireRole('admin'), CategoryController.update);
router.get('/:id/delete', requireRole('admin'), CategoryController.delete); // Using GET for delete link for simplicity in this lab, though POST/DELETE is better.

module.exports = router;
