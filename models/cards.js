const db = require('./');

module.exports = {

    search: async function(search_string) {
        try {

            const statement = `
                SELECT
                    id, name,
                    cost, upgraded_cost,
                    description, upgraded_description,
                    rarity, type, subtype, swaps_to
                FROM cards
                WHERE search_vector @@ plainto_tsquery($1);
            `
            const parameters = [search_string];
            const result = await db.query(statement, parameters);
            return result.rows;

        } catch (error) {
            console.warn('error occured during card search');
            throw(error);
        }
    },

    getAll: async function() {
        try {

            const statement = `
                SELECT
                    id, name,
                    cost, upgraded_cost,
                    description, upgraded_description,
                    rarity, type, subtype, swaps_to
                FROM cards;
            `
            const result = await db.query(statement, []);
            return result.rows;

        } catch (error) {
            console.warn('error occured during card retrieval');
            throw(error);
        }
    },

    getByIds: async function(cardIDArray) {
        try {
            
            const statement = `
                SELECT
                    id, name,
                    cost, upgraded_cost,
                    description, upgraded_description,
                    rarity, type, subtype, swaps_to
                FROM cards
                WHERE id = ANY($1);
            `
            const parameters = [cardIDArray]
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