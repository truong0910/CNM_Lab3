const dynamoDb = require('../db/dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'ProductLogs';

class LogRepository {
    static async create(productId, action, userId) {
        const logId = uuidv4();
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                logId,
                productId,
                action, // CREATE, UPDATE, DELETE
                userId,
                time: new Date().toISOString()
            }
        });

        try {
            await dynamoDb.send(command);
        } catch (error) {
            console.error('Error logging action:', error);
            // Don't throw error to avoid blocking main action? Or throw?
            // Usually logging failure shouldn't stop the main business flow, but for audit strictness maybe it should.
            // For this lab, we'll log to console but not crash.
        }
    }
}

module.exports = LogRepository;
