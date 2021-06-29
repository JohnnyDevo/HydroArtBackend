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
    }
}