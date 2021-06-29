const keywords = require('../../models/keywords');

module.exports = {
    getAllByCardId: async function(cardID) {
        //todo: security measures on ID string?
        if (cardID) {
            const result = await keywords.getAllByCardId(cardID);
            return result;
        } else {
            console.warn('invalid card ID');
            throw new Error();
        }
    }
}