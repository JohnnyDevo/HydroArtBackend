const cards = require("../../models/cards");

module.exports = {
    search: async function(search_string) {
        //todo: security measures on search string?
        if (search_string) {
            return await cards.search(search_string);
        } else {
            console.warn('invalid search string');
            throw new Error();
        }
    },

    getAll: async function() {
        return await cards.getAll();
    }
}