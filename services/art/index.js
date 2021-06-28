const artdb = require('../../models/art');

module.exports = {
    getById: async function(artID) {
        //todo: security measures on ID string?
        if (artID) {
            const result = await artdb.getById(artID);
            return result;
        } else {
            console.warn('invalid art ID');
            throw new Error();
        }
    },

    create: async function(cardID, userID, buffer) {
        //todo: validate the image and resize
        const result = await artdb.create(cardID, userID, buffer)
        if (result) {
            return result;
        } else {
            console.warn('error when adding art to database');
            throw new Error();
        }
    }
}