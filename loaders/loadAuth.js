const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../models/users.js');

module.exports = {
    authLoader: function(app) {
        passport.use(new LocalStrategy(async (username, password, callback) => {
            try {
                let success = false;
                let user = {};

                //TODO: retrieve username, salt password, and compare.

                if (success) {
                    return callback(null, user)
                } else {
                    return callback(null, false);
                }
            } catch (error) {
                return callback(error);
            }
        }));

        passport.serializeUser(function(user, callback) {
            callback(null, user.id);
        });
        
        passport.deserializeUser(async function(id, callback) {
            try {
                const user = await users.findById(id);
                if (user) {
                    callback(null, user);
                } else {
                    console.warn('could not find a user when deserializing');
                    throw new Error();
                }
            } catch (error) {
                callback(error);
            }
        });
        
        app.use(passport.initialize());
        app.use(passport.session());

        app.post('/login', 
            passport.authenticate('local'),
            (req, res) => {
                res.status(200).send(req.user);
            }
        );
    }
}