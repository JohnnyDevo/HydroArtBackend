const cards = require("../../models/cards");
const artdb = require("../../models/art");

async function addInfo(cards) {
    const artsCardIDArray = [];
    const swapsToIDArray = [];
    for (const card in cards) {
        if (!artsCardIDArray.includes(cards[card].id)) {
            artsCardIDArray.push(cards[card].id);
        }
        if (cards[card].swaps_to) {
            swapsToIDArray.push(cards[card].swaps_to);
            if (!artsCardIDArray.includes(cards[card].swaps_to)) {
                artsCardIDArray.push(cards[card].swaps_to);
            }
        }
    }
    const artResult = artdb.getDefaultArtsByCardIds(artsCardIDArray);
    const swapsResult = cards.getByIds(swapsToIDArray);
    const result = {
        cards: cards,
        arts: await artResult,
        swaps: await swapsResult
    }
    return result;
}

module.exports = {
    search: async function(search_string) {
        //todo: security measures on search string?
        if (search_string) {
            const cardResult = await cards.search(search_string);
            return await addInfo(cardResult);
        } else {
            console.warn('invalid search string');
            throw new Error();
        }
    },

    getAll: async function() {
        const cardResult = await cards.getAll();
        return await addInfo(cardResult);
    },

    getByIds: async function(cardIDArray) {
        //todo: security measures on ID string?
        if (cardID) {
            const result = await cards.getByIds(cardIDArray);
            return result;
        } else {
            console.warn('invalid card ID');
            throw new Error();
        }
    }
}