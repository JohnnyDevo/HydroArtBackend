const db = require('./');

module.exports = {

    getById: async function(artID) {
        try {
            
            const statement = `
                SELECT *
                FROM art_submissions
                WHERE id = $1;
            `
            const arguments = [artID];

            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows[0];
            }

        } catch (error) {
            console.warn('error occured during art retrieval');
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

    getAllArtsByCardId: async function(cardID) {
        try {
            const statement = `
                SELECT 
                    art_submissions.id AS id, 
                    art_submissions.card_id AS card_id,
                    cards.name AS card_name,
                    art_submissions.user_id AS user_id,
                    users.credits_name AS credits_name,
                    users.credits_url AS credits_url, 
                    encode(art_submissions.image, 'base64')
                FROM art_submissions 
                LEFT JOIN users ON art_submissions.user_id = users.id
                LEFT JOIN cards ON art_submissions.card_id = cards.id
                WHERE art_submissions.card_id = $1;
            `
            const arguments = [cardID];

            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows;
            }
            
        } catch (error) {
            console.warn('error when retrieving arts from database');
        }
    },

    setDefaultArt: async function(cardID, artID) {
        try {
            const statement = `
                INSERT INTO default_art
                VALUES ($1, $2);
            `
            const arguments = [cardID, artID];
            db.query(statement, arguments);
            
        } catch (error) {
            console.warn('error when setting default art in database');
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
    },

    getAll: async function() {
        try {
            const statement = `
                SELECT 
                    art_submissions.id AS id, 
                    art_submissions.card_id AS card_id,
                    cards.name AS card_name,
                    art_submissions.user_id AS user_id,
                    users.credits_name AS credits_name,
                    users.credits_url AS credits_url, 
                    encode(art_submissions.image, 'base64')
                FROM art_submissions 
                LEFT JOIN users ON art_submissions.user_id = users.id
                LEFT JOIN cards ON art_submissions.card_id = cards.id;
            `
            const result = await db.query(statement, []);
            if (result.rows?.length) {
                return result.rows;
            }
        } catch (error) {
            console.warn('error when retrieving arts from database');
            throw(error);
        }
    },

    getAllArtsByUserId: async function(userID) {
        try {
            const statement = `
                SELECT 
                    art_submissions.id AS id, 
                    art_submissions.card_id AS card_id,
                    cards.name AS card_name,
                    art_submissions.user_id AS user_id,
                    users.credits_name AS credits_name,
                    users.credits_url AS credits_url, 
                    encode(art_submissions.image, 'base64')
                FROM art_submissions 
                LEFT JOIN users ON art_submissions.user_id = users.id
                LEFT JOIN cards ON art_submissions.card_id = cards.id
                WHERE art_submissions.user_id = $1;
            `
            const arguments = [userID];

            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows;
            }
        } catch (error) {
            console.warn('error when retrieving arts from database');
            throw(error);
        }
    },

    getAllArtsByCardAndUserIds: async function(cardID, userID) {
        try {
            const statement = `
                SELECT 
                    art_submissions.id AS id, 
                    art_submissions.card_id AS card_id,
                    cards.name AS card_name,
                    art_submissions.user_id AS user_id,
                    users.credits_name AS credits_name,
                    users.credits_url AS credits_url, 
                    encode(art_submissions.image, 'base64')
                FROM art_submissions 
                LEFT JOIN users ON art_submissions.user_id = users.id
                LEFT JOIN cards ON art_submissions.card_id = cards.id
                WHERE art_submissions.card_id = $1 AND art_submissions.user_id = $2;
            `
            const arguments = [cardID, userID];

            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows;
            }
        } catch (error) {
            console.warn('error when retrieving arts from database');
            throw(error);
        }
    },

    getAllContributors: async function() {
        try {
            const statement = `
                SELECT 
                    users.credits_name AS credits_name,
                    users.credits_url AS credits_url,
                    COUNT(*) AS contributions,
                    users.id AS user_id
                FROM 
                    art_submissions INNER JOIN users
                    ON art_submissions.user_id = users.id
                GROUP BY
                    users.credits_name,
                    users.credits_url,
                    users.id
                ORDER BY
                    contributions DESC;
            `
            
            const result = await db.query(statement, []);
            if (result.rows?.length) {
                return result.rows;
            }
        } catch (error) {
            console.warn('error when retrieving contribution info from database');
            throw(error);
        }
    },

    deleteArtById: async function(artID) {
        try {
            const statement = `
                DELETE FROM art_submissions
                WHERE id = $1
                RETURNING card_id;
            `
            const arguments = [artID];

            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows[0];
            }
        } catch (error) {
            console.warn('error when deleting from art submissions');
            throw(error);
        }
    },

    deleteByUserId: async function(userID) {
        try {
            const statement = `
                DELETE FROM art_submissions
                WHERE user_id = $1
                RETURNING card_id;
            `
            const arguments = [userID];

            const result = await db.query(statement, arguments);
            if (result.rows?.length) {
                return result.rows;
            }
        } catch (error) {
            console.warn('error when deleting art submissions');
            throw(error);
        }
    }
}