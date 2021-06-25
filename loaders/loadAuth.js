const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userService = require('../services/users');

module.exports = {
    authLoader: function(app) {
        passport.use(new LocalStrategy(async (name, password, callback) => {
            try {
                const user = await userService.findUser({ username: name })
                const success = await userService.validatePassword(user, password);

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
                const user = await userService.findUser({ id: id });
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