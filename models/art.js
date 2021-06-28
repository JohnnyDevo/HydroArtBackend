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

    getDefaultArtsByCardIds: async function(cardIDArray) {
        try {
            const statement = `
                SELECT 
                    art_submissions.id AS id,
                    art_submissions.card_id AS card_id,
                    art_submissions.user_id AS user_id,
                    encode(art_submissions.image, 'base64')
                FROM
                    art_submissions INNER JOIN default_art
                ON
                    art_submissions.id = default_art.art_id
                WHERE
                    default_art.card_id = ANY($1);
            `
            const arguments = [cardIDArray];

            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows;
            }

        } catch (error) {
            console.warn('error when retrieving default art from database');
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