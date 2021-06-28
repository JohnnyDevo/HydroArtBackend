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
    }
}