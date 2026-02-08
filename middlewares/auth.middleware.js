const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/login');
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === role) {
            return next();
        }
        return res.status(403).send('Forbidden: You do not have permission to perform this action');
    };
};

module.exports = {
    requireLogin,
    requireRole
};