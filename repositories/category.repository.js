const dynamoDb = require('../db/dynamodb');
const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Categories';

class CategoryRepository {
    static async getAll() {
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });

        try {
            const response = await dynamoDb.send(command);
            return response.Items || [];
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    }

    static async getById(categoryId) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { categoryId }
        });

        try {
            const response = await dynamoDb.send(command);
            return response.Item;
        } catch (error) {
            console.error('Error getting category:', error);
            throw error;
        }
    }

    static async create(name, description) {
        const categoryId = uuidv4();
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                categoryId,
                name,
                description,
                createdAt: new Date().toISOString()
            }
        });

        try {
            await dynamoDb.send(command);
            return { categoryId, name, description };
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    static async update(categoryId, name, description) {
        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { categoryId },
            UpdateExpression: 'set #name = :name, description = :description',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':description': description
            },
            ReturnValues: 'ALL_NEW'
        });

        try {
            const response = await dynamoDb.send(command);
            return response.Attributes;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    static async delete(categoryId) {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { categoryId }
        });

        try {
            await dynamoDb.send(command);
            return { success: true };
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

module.exports = CategoryRepository;
