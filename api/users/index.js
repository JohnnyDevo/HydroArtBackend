const router = require('express-promise-router');
const userService = require('../../services/users');
const validateUser = require('./validateUser');
const validator = require('validator');
const { body, validationResult } = require('express-validator');
const saltAndHash = require('../../services/saltAndHash');

const usersRouter = router(); //mounted to '/users'

//Users...
//...can get the username and user ID for their current session
usersRouter.get('/', validateUser, async (req, res, next) => {
    res.status(200).json({
        id: req.user.id,
        username: validator.escape(req.user.username)
    });
});

//...can view their own profile
usersRouter.get('/profile', validateUser, async (req, res, next) => {
    const user = await userService.findUser({ id: req.user.id });
    if (user) {
        delete user.password;
        res.status(200).json({
            id: user.id,
            username: validator.escape(user.username),
            credits_name: validator.escape(user.credits_name),
            credits_url: user.credits_url,
            contact_info: validator.escape(user.contact_info)
        });
    } else {
        console.warn('updated user was not returned by db');
        next(new Error());
    }
});

//...can destroy their current session
usersRouter.post('/logout', validateUser, async (req, res, next) => {
    try {
        await req.session.destroy();
        res.status(204).send();
    } catch (error) {
        console.warn('failed to log out');
        next(error);
    }
});

//...can update their user info
usersRouter.put('/',
    validateUser,
    body("credits_url").isURL().optional({ nullable: true, checkFalsy: true }),
    body("password").isLength({ min: 6 }).optional({ nullable: true, checkFalsy: true }),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await userService.findUser({ id: req.user.id });
            if (user) {

                //validate password
                if (!req.body.old_password) {
                    return res.status(400).send('Password required to update account info');
                } else {
                    if (!userService.validatePassword(user, req.body.old_password)) {
                        return res.status(401).send();
                    }
                }

                //default to old values
                let hash;
                if (!req.body.username) {
                    req.body.username = user.username;
                }
                if (!req.body.password) {
                    hash = user.password;
                } else {
                    hash = await saltAndHash.makeHash(req.body.password, await saltAndHash.makeSalt());
                }
                if (!req.body.credits_name) {
                    req.body.credits_name = user.credits_name;
                }
                if (!req.body.credits_url) {
                    req.body.credits_url = user.credits_url;
                }
                if (!req.body.contact_info) {
                    req.body.contact_info = user.contact_info;
                }

                //update user
                const updatedUser = await userService.updateUser(req.user.id, {
                    username: req.body.username,
                    hash: hash,
                    credits_name: req.body.credits_name,
                    credits_url: req.body.credits_url,
                    contact_info: req.body.contact_info
                });

                if (updatedUser) {
                    req.user.username = updatedUser.username;
                    res.status(201).json({
                        id: updatedUser.id,
                        username: validator.escape(updatedUser.username)
                    });
                } else {
                    console.warn('updated user was not returned by db');
                    next(new Error());
                }
            } else {
                console.warn('could not find currently logged in user');
                next(new Error());
            }
        } catch (error) {
            console.warn('error during user update');
            next(error);
        }
});

//...can delete their own account
usersRouter.delete('/', body("cascade").toBoolean(), validateUser, async (req, res, next) => {
    try {
        const user = await userService.findUser({ id: req.user.id });

        //validate password
        if (!req.body.password) {
            return res.status(400).send('Password required to delete');
        } else {
            if (!userService.validatePassword(user, req.body.password)) {
                return res.status(401).send();
            }
        }
        await userService.deleteUser(req.user.id, req.body.cascade);
        await req.session.destroy();
        res.status(204).send();
    } catch (error) {
        console.warn('error during user deletion');
        next(error);
    }
});

//Anyone...
//...can create a new user
usersRouter.post('/', 
    body("username").exists(),
    body("credits_url").isURL().optional({ nullable: true, checkFalsy: true }),
    body("password").isLength({ min: 6 }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Needs both a username and a password');
        }
        try {
            const dupe = await userService.findUser({ username: req.body.username });
            if (dupe) {
                res.status(409).send('Username is already taken');
            } else {
                const info = {
                    username: req.body.username,
                    password: req.body.password,
                    credits_name: req.body.credits_name,
                    credits_url: req.body.credits_url,
                    contact_info: req.body.contact_info
                }
                const newUser = await userService.createUser(info);
                if (newUser) {
                    res.status(201).json({
                        id: newUser.id,
                        username: validator.escape(newUser.username)
                    });
                } else {
                    console.warn('new user was not returned by service');
                    next(new Error());
                }
            }
        } catch (error) {
            console.warn('error during user creation');
            next(error);
        }
});

//...can check if a username is taken. name exists = 409, doesn't exist = 200
usersRouter.get('/:username', async (req, res, next) => {
    try {
        if (!req.params.username) {
            return res.status(400).send("no username provided");
        }
        const existingUser = await userService.findUser({ username: req.params.username });
        if (existingUser) {
            res.status(409).send("username is taken");
        } else {
            res.status(200).send();
        }
    } catch (error) {
        console.warn('error when checking username');
        next(error);
    }
});

module.exports = usersRouter;