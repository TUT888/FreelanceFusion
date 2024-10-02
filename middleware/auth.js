function isAuthenticated(req, res, next) {
    console.log('Auth Middleware - Session:', req.session);

    if (req.session.user) {
        return next();
    }
    res.redirect('/sign-in');
}

module.exports = isAuthenticated;
