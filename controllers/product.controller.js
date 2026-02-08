const ProductService = require('../services/product.service');
const CategoryService = require('../services/category.service');

class ProductController {
    static async index(req, res) {
        try {
            // Handle filters
            const { name, categoryId, minPrice, maxPrice } = req.query;
            let products;

            if (name || categoryId || minPrice || maxPrice) {
                products = await ProductService.searchProducts({ name, categoryId, minPrice, maxPrice });
            } else {
                products = await ProductService.getAllProducts();
            }

            // Client-side sorting or DB sorting? 
            // DynamoDB Scan doesn't sort by createdAt easily without GSI. 
            // We'll sort in memory for this lab size.
            products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

            const categories = await CategoryService.getAllCategories();

            res.render('products/index', {
                products,
                categories,
                user: req.session.user,
                filters: req.query
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async showAddForm(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.render('products/add', { categories, user: req.session.user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async create(req, res) {
        try {
            const { name, price, quantity, url_image, categoryId } = req.body;
            await ProductService.createProduct(req.session.user.userId, {
                name,
                price,
                quantity,
                url_image: url_image || '',
                categoryId
            });
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async showEditForm(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) return res.status(404).send('Product not found');

            const categories = await CategoryService.getAllCategories();
            res.render('products/edit', { product, categories, user: req.session.user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async update(req, res) {
        try {
            const { name, price, quantity, url_image, categoryId } = req.body;
            await ProductService.updateProduct(req.session.user.userId, req.params.id, {
                name,
                price,
                quantity,
                url_image: url_image || '',
                categoryId
            });
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async delete(req, res) {
        try {
            await ProductService.deleteProduct(req.session.user.userId, req.params.id);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = ProductController;