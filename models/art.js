const db = require('./');

module.exports = {

    getById: async function(artID) {
        try {
            
            const statement = `
                SELECT *
                FROM art_submissions
                WHERE id = $1;
            `
            const result = await db.query(statement, []);
            if (result.rows?.length) {
                return result.rows[0];
            }

        } catch (error) {
            console.warn('error occured during card retrieval');
            throw(error);
        }
    },

    create: async function(cardID, userID, buffer) {
        try {
            const statement = `
                INSERT INTO art_submissions
                VALUES (DEFAULT, $1, $2, $3)
                RETURNING id, card_id, user_id, encode(image, 'base64');
            `
            const arguments = [cardID, userID, buffer];
            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows[0];
            }

        } catch (error) {
            console.warn('error when inserting image submission into database');
            throw(error);
        }
    }
}