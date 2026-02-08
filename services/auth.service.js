const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');

class AuthService {
    static async login(username, password) {
        const user = await UserRepository.findByUsername(username);
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return user;
    }

    static async register(username, password, role) {
        // Check if user exists
        const existingUser = await UserRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        return await UserRepository.create(username, passwordHash, role);
    }
}

module.exports = AuthService;
