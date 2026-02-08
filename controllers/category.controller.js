const CategoryService = require('../services/category.service');

class CategoryController {
    static async index(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.render('categories/index', { categories, user: req.session.user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static showAddForm(req, res) {
        res.render('categories/add', { user: req.session.user });
    }

    static async create(req, res) {
        try {
            const { name, description } = req.body;
            await CategoryService.createCategory(name, description);
            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async showEditForm(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).send('Category not found');
            }
            res.render('categories/edit', { category, user: req.session.user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async update(req, res) {
        try {
            const { name, description } = req.body;
            await CategoryService.updateCategory(req.params.id, name, description);
            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async delete(req, res) {
        try {
            // Check implicit rule: products might depend on this? 
            // We proceed as per prompt (Soft delete or hard delete? "xoá category -> không xoá sản phẩm")
            await CategoryService.deleteCategory(req.params.id);
            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = CategoryController;
