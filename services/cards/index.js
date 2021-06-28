const cards = require("../../models/cards");

module.exports = {
    search: async function(search_string) {
        //todo: security measures on search string?
        if (search_string) {
            const result = await cards.search(search_string);
            return result;
        } else {
            console.warn('invalid search string');
            throw new Error();
        }
    },

    getAll: async function() {
        const result = await cards.getAll();
        return result;
    },

    getById: async function(cardID) {
        //todo: security measures on ID string?
        if (cardID) {
            const result = await cards.getById(cardID);
            return result;
        } else {
            console.warn('invalid card ID');
            throw new Error();
        }
    }
}