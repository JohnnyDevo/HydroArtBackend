const cards = require("../../models/cards");
const artdb = require("../../models/art");

module.exports = {
    search: async function(search_string) {
        //todo: security measures on search string?
        if (search_string) {
            const cardResult = await cards.search(search_string);
            const cardIDArray = [];
            for (const card in cardResult) {
                cardIDArray.push(cardResult[card].id);
            }
            const artResult = await artdb.getDefaultArtsByCardIds(cardIDArray);
            const result = {
                cards: cardResult,
                arts: artResult
            }
            return result;
        } else {
            console.warn('invalid search string');
            throw new Error();
        }
    },

    getAll: async function() {
        const cardResult = await cards.getAll();
        const cardIDArray = [];
        for (const card in cardResult) {
            cardIDArray.push(cardResult[card].id);
        }
        const artResult = await artdb.getDefaultArtsByCardIds(cardIDArray);
        const result = {
            cards: cardResult,
            arts: artResult
        }
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