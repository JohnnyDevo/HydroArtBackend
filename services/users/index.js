const users = require("../../models/users");

module.exports = {
    findUser: async function(user) {
        if (user.id) {
            return await users.findById(user.id);
        } else if (user.username) {
            return await users.findByUsername(user.username);
        } else {
            console.warn('no username or id provided');
            throw new Error();
        }
    },

    createUser: async function(info) {
        if (!info.password || !info.username) {
            console.warn('needs both a username and a password');
            throw new Error();
        }
        let hash;
        //todo: salt and hash password
        return await users.create(
            info.username, 
            hash, 
            info.credits_name,
            info.credits_url,
            info.contact_info
        );
    },

    validatePassword: async function(user, password) {
        if (!user || !password) {
            console.warn('needs both a username and a password');
            throw new Error();
        }
        //todo: salt, hash, and compare password
    },

    updateUser: async function(id, info) {
        if (!id || !info) {
            console.warn('needs both id and payload');
            throw new Error();
        }
        let hash;
        //todo: salt and hash password
        return await users.updateById(
            id,
            info.username, 
            hash, 
            info.credits_name,
            info.credits_url,
            info.contact_info
        );
    },

    deleteUser: async function(id) {
        if (!id) {
            console.warn('needs id');
            throw new Error();
        }
        await users.deleteById(id);
    }
}