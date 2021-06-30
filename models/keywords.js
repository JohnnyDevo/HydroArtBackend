const db = require('./');

module.exports = {

    getAllByCardId: async function(cardID) {
        try {
            
            const statement = `
                SELECT
                    keywords.name AS name, keywords.description AS description
                FROM
                    keywords_on_cards INNER JOIN keywords
                ON
                    keywords_on_cards.keyword_id = keywords.id
                WHERE
                    keywords_on_cards.card_id = $1;
            `
            const parameters = [cardID];
            const result = await db.query(statement, parameters);
            if (result.rows?.length) {
                return result.rows;
            }

        } catch (error) {
            console.warn('error occured during card retrieval');
            throw(error);
        }
    }
}