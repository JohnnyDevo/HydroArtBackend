const users = require("../../models/users");
const saltAndHash = require("../saltAndHash");

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
        const hash = await saltAndHash.makeHash(info.password, await saltAndHash.makeSalt());
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
        const hash = (await users.findById(user.id)).password;
        return await saltAndHash.compare(password, hash);
    },

    updateUser: async function(id, info) {
        if (!id || !info) {
            console.warn('needs both id and payload');
            throw new Error();
        }
        const hash = await saltAndHash.makeHash(info.password, await saltAndHash.makeSalt());
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