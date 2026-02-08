const dynamoDb = require('../db/dynamodb');
const { PutCommand, GetCommand, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_PRODUCTS_TABLE || 'Products';

class ProductRepository {
    static async getAll() {
        // Only return non-deleted items
        const command = new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: 'attribute_not_exists(isDeleted) OR isDeleted = :false',
            ExpressionAttributeValues: {
                ':false': false
            }
        });

        try {
            const response = await dynamoDb.send(command);
            return response.Items || [];
        } catch (error) {
            console.error('Error getting all products:', error);
            throw error;
        }
    }

    static async getById(id) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id }
        });

        try {
            const response = await dynamoDb.send(command);
            const item = response.Item;
            if (item && item.isDeleted) return null; // Treat as not found
            return item;
        } catch (error) {
            console.error('Error getting product by ID:', error);
            throw error;
        }
    }

    static async create(productData) {
        const id = uuidv4();
        const { name, price, quantity, url_image, categoryId } = productData;

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                id,
                name,
                price: Number(price),
                quantity: Number(quantity),
                categoryId, // New field
                url_image,
                isDeleted: false, // Default
                createdAt: new Date().toISOString()
            }
        });

        try {
            await dynamoDb.send(command);
            return { id, ...productData };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async update(id, productData) {
        const { name, price, quantity, url_image, categoryId } = productData;

        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'SET #name = :name, price = :price, quantity = :quantity, url_image = :url_image, categoryId = :categoryId, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':price': Number(price),
                ':quantity': Number(quantity),
                ':url_image': url_image,
                ':categoryId': categoryId,
                ':updatedAt': new Date().toISOString()
            },
            ReturnValues: 'ALL_NEW'
        });

        try {
            const response = await dynamoDb.send(command);
            return response.Attributes;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Soft Delete
    static async delete(id) {
        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'SET isDeleted = :true, deletedAt = :deletedAt',
            ExpressionAttributeValues: {
                ':true': true,
                ':deletedAt': new Date().toISOString()
            }
        });

        try {
            await dynamoDb.send(command);
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    static async search(filters) {
        // filters: { name, categoryId, minPrice, maxPrice }
        let filterExpression = '(attribute_not_exists(isDeleted) OR isDeleted = :false)';
        let expressionAttributeValues = { ':false': false };
        let expressionAttributeNames = {}; // For reserved words like 'name' if needed in filter

        if (filters.name) {
            filterExpression += ' AND contains(#name, :name)';
            expressionAttributeValues[':name'] = filters.name;
            expressionAttributeNames['#name'] = 'name';
        }

        if (filters.categoryId) {
            filterExpression += ' AND categoryId = :categoryId';
            expressionAttributeValues[':categoryId'] = filters.categoryId;
        }

        if (filters.minPrice) {
            filterExpression += ' AND price >= :minPrice';
            expressionAttributeValues[':minPrice'] = Number(filters.minPrice);
        }

        if (filters.maxPrice) {
            filterExpression += ' AND price <= :maxPrice';
            expressionAttributeValues[':maxPrice'] = Number(filters.maxPrice);
        }

        const command = new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
        });

        try {
            const response = await dynamoDb.send(command);
            return response.Items || [];
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }
}

module.exports = ProductRepository;
