const AuthService = require('../services/auth.service');

class AuthController {
    static showLogin(req, res) {
        if (req.session.user) {
            return res.redirect('/products');
        }
        res.render('auth/login', { error: null });
    }

    static async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await AuthService.login(username, password);
            if (!user) {
                return res.render('auth/login', { error: 'Invalid username or password' });
            }
            req.session.user = user;
            res.redirect('/products');
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Server Error');
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }

    static showRegister(req, res) {
        res.render('auth/register', { error: null });
    }

    static async register(req, res) {
        const { username, password, role } = req.body;
        try {
            await AuthService.register(username, password, role || 'staff');
            res.redirect('/login');
        } catch (error) {
            res.render('auth/register', { error: error.message });
        }
    }
}

module.exports = AuthController;