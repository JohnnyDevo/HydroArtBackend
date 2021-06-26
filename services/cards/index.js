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
    }
}