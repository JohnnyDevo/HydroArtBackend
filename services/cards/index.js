const cards = require("../../models/cards");
const artdb = require("../../models/art");

async function addInfo(cardsResult) {
    const artsCardIDArray = [];
    const swapsToIDArray = [];
    for (const card in cardsResult) {
        if (!artsCardIDArray.includes(cardsResult[card].id)) {
            artsCardIDArray.push(cardsResult[card].id);
        }
        if (cardsResult[card].swaps_to) {
            swapsToIDArray.push(cardsResult[card].swaps_to);
            if (!artsCardIDArray.includes(cardsResult[card].swaps_to)) {
                artsCardIDArray.push(cardsResult[card].swaps_to);
            }
        }
    }
    const artResult = artdb.getDefaultArtsByCardIds(artsCardIDArray);
    const swapsResult = cards.getByIds(swapsToIDArray);
    const result = {
        cards: cardsResult,
        arts: await artResult,
        swaps: await swapsResult
    }
    return result;
}

module.exports = {
    search: async function(search_string) {
        //todo: security measures on search string?
        if (search_string) {
            const cardsResult = await cards.search(search_string);
            return await addInfo(cardsResult);
        } else {
            console.warn('invalid search string');
            throw new Error();
        }
    },

    getAll: async function() {
        const cardsResult = await cards.getAll();
        return await addInfo(cardsResult);
    },

    getByIds: async function(cardIDArray) {
        //todo: security measures on ID string?
        if (cardIDArray) {
            const result = await cards.getByIds(cardIDArray);
            return result;
        } else {
            console.warn('invalid card ID');
            throw new Error();
        }
    }
}