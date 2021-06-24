const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('../models');
const env = require('../config');

module.exports = {
    sessionLoader: function(app) {
        let cookieSecurity = false;
        if (env.environment === 'production') {
            cookieSecurity = true;
        }

        app.use(session({
            store: new pgSession({
                pool: db.pool
            }),
            secret: env.secret,
            resave: false,
            saveUninitialized: true,
            cookie: { 
                maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
                secure: cookieSecurity
            }
        }));
    }
}