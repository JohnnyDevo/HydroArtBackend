const artdb = require('../../models/art');
const Jimp = require('jimp');

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

    getAllByCardId: async function(cardID) {
        //todo: security measures on ID string?
        if (cardID) {
            const result = await artdb.getAllArtsByCardId(cardID);
            return result;
        } else {
            console.warn('invalid card ID');
            throw new Error();
        }
    },

    getDefaultArtsByCardIds: async function(cardIDArray) {
        const result = artdb.getDefaultArtsByCardIds(cardIDArray);
        return result;
    },

    create: async function(cardID, userID, file) {

        const image = await Jimp.read(file.buffer);                 //begin image manipulation
        image.resize(500, 380);                                     //size of larger card images
        image.rgba(true);                                           //transparency
        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);   //convert all images to PNG, save to buffer

        const result = await artdb.create(cardID, userID, buffer);
        if (result) {
            const defaultArt = await artdb.getDefaultArtsByCardIds([result.card_id]);
            if (!defaultArt) {
                artdb.setDefaultArt(result.card_id, result.id);
            }
            return result;
        } else {
            console.warn('error when adding art to database');
            throw new Error();
        }
    },

    getAll: async function() {
        const result = await artdb.getAll();
        return result;
    },

    getAllArtsByUserId: async function(userID) {
        //todo: security measures on ID string?
        if (userID) {
            const result = await artdb.getAllArtsByUserId(userID);
            return result;
        } else {
            console.warn('invalid user id');
            throw new Error();
        }
    },

    getAllArtsByCardAndUserIds: async function(cardID, userID) {
        //todo: security measures on id strings?
        if (cardID && userID) {
            const result = await artdb.getAllArtsByCardAndUserIds(cardID, userID);
            return result;
        } else {
            console.warn('invalid input');
            throw new Error();
        }
    },

    getAllContributors: async function() {
        const result = await artdb.getAllContributors();
        return result;
    },

    delete: async function(art) {
        const artsCard = await artdb.deleteArtById(art.id);
        if (artsCard) {
            console.log(artsCard);
            const defaultArt = await artdb.getDefaultArtsByCardIds([artsCard])
            if (!defaultArt) {
                const arts = await artdb.getAllArtsByCardId(art.card_id);
                if (arts) {
                    artdb.setDefaultArt(art.card_id, arts[0].id);
                }
            }
        }
    }
}