const ProductRepository = require('../repositories/product.repository');
const LogRepository = require('../repositories/log.repository');

class ProductService {
    static async getAllProducts() {
        return await ProductRepository.getAll();
    }

    static async getProductById(id) {
        return await ProductRepository.getById(id);
    }

    static async createProduct(userId, productData) {
        const product = await ProductRepository.create(productData);
        // Log action
        await LogRepository.create(product.id, 'CREATE', userId);
        return product;
    }

    static async updateProduct(userId, id, productData) {
        const product = await ProductRepository.update(id, productData);
        // Log action
        await LogRepository.create(id, 'UPDATE', userId);
        return product;
    }

    static async deleteProduct(userId, id) {
        await ProductRepository.delete(id);
        // Log action
        await LogRepository.create(id, 'DELETE', userId);
        return { success: true };
    }

    static async searchProducts(filters) {
        return await ProductRepository.search(filters);
    }
}

module.exports = ProductService;
