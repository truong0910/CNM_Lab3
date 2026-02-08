const CategoryRepository = require('../repositories/category.repository');

class CategoryService {
    static async getAllCategories() {
        return await CategoryRepository.getAll();
    }

    static async getCategoryById(id) {
        return await CategoryRepository.getById(id);
    }

    static async createCategory(name, description) {
        return await CategoryRepository.create(name, description);
    }

    static async updateCategory(id, name, description) {
        return await CategoryRepository.update(id, name, description);
    }

    static async deleteCategory(id) {
        // Business Rule: Check if products exist in this category? 
        // Prompt says: "Khi xoá category → không xoá sản phẩm (business rule)"
        // It doesn't strictly say we MUST prevent deletion if products exist, 
        // but typically we might want to warn or just allow it (orphan products).
        // Since the prompt explicitly says "Don't delete products", it implies orphan products are allowed.
        return await CategoryRepository.delete(id);
    }
}

module.exports = CategoryService;
