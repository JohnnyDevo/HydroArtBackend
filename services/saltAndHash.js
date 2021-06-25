const bcrypt = require('bcrypt');
const saltRounds = 8; //my server's a bit on the smaller side

module.exports = {
    makeSalt: async function() {
        return await bcrypt.genSalt(saltRounds);
    },

    makeHash: async function(password, salt) {
        return await bcrypt.hash(password, salt);
    },

    compare: async function(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}