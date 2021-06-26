const router = require('express-promise-router');
const userService = require('../../services/users');
const validateUser = require('../validateUser');

const usersRouter = router(); //mounted to '/users'

usersRouter.get('/', validateUser, async (req, res, next) => {
    res.status(200).json(req.user);
});

usersRouter.get('/profile', validateUser, async (req, res, next) => {
    const user = await userService.findUser({ id: req.user.id });
    if (user) {
        delete user.password;
        res.status(200).json(user);
    } else {
        console.warn('updated user was not returned by db');
        next(new Error());
    }
});

usersRouter.post('/logout', validateUser, async (req, res, next) => {
    try {
        await req.session.destroy();
        res.status(204).send();
    } catch (error) {
        console.warn('failed to log out');
        next(error);
    }
});

usersRouter.post('/', async (req, res, next) => {
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
                res.status(201).json(newUser);
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

usersRouter.put('/', validateUser, async (req, res, next) => {
    try {
        const user = await userService.findUser({ id: req.user.id });
        if (user) {

            //validate password
            if (!req.body.old_password) {
                return res.status(400).send('Password required to update account info');
            } else {
                if (!userService.validatePassword(user, req.body.old_password)) {
                    res.status(401).send();
                }
            }

            //default to old values
            if (!req.body.username) {
                req.body.username = user.username;
            }
            if (!req.body.password) {
                req.body.password = req.body.old_password;
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
            const info = {
                username: req.body.username,
                password: req.body.password,
                credits_name: req.body.credits_name,
                credits_url: req.body.credits_url,
                contact_info: req.body.contact_info
            }
            const updatedUser = await users.updateById(
                req.body.username,
                hash,
                req.body.credits_name,
                req.body.credits_url,
                req.body.contact_info
            );

            if (updatedUser) {
                req.user.username = updatedUser.username;
                res.status(201).json(updatedUser);
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

usersRouter.delete('/', validateUser, async (req, res, next) => {
    try {
        const user = await userService.findUser({ id: req.user.id });

        //validate password
        if (!req.body.old_password) {
            return res.status(400).send('Password required to update account info');
        } else {
            if (!userService.validatePassword(user, req.body.old_password)) {
                res.status(401).send();
            }
        }

        await userService.deleteUser(req.user.id);
    } catch (error) {
        console.warn('error during user deletion');
        next(error);
    }
});

module.exports = usersRouter;