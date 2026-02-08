const dynamoDb = require('../db/dynamodb');
const { PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Users'; // Hardcoded for simplicity or env var

class UserRepository {
    static async findByUsername(username) {
        // Note: Scan is inefficient for large datasets. In prod, use GSI on username.
        const command = new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username': username
            }
        });

        try {
            const response = await dynamoDb.send(command);
            return response.Items[0];
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    static async create(username, passwordHash, role = 'staff') {
        const userId = uuidv4();
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                userId,
                username,
                password: passwordHash,
                role,
                createdAt: new Date().toISOString()
            }
        });

        try {
            await dynamoDb.send(command);
            return { userId, username, role };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

module.exports = UserRepository;
