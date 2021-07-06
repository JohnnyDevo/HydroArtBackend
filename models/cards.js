const db = require('./');

module.exports = {

    search: async function(search_string) {
        try {

            const statement = `
                SELECT
                    cards.id AS id, cards.name AS name,
                    cards.cost AS cost, cards.upgraded_cost AS upgraded_cost,
                    cards.description AS description, cards.upgraded_description AS upgraded_description,
                    cards.rarity AS rarity, cards.type AS type, cards.subtype AS subtype, cards.swaps_to AS swaps_to
                FROM cards LEFT JOIN card_rarity_order
                ON cards.rarity = card_rarity_order.rarity_name
                WHERE search_vector @@ plainto_tsquery($1)
                ORDER BY 
                    card_rarity_order.rarity_order,
                    cards.name;
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
                    cards.id AS id, cards.name AS name,
                    cards.cost AS cost, cards.upgraded_cost AS upgraded_cost,
                    cards.description AS description, cards.upgraded_description AS upgraded_description,
                    cards.rarity AS rarity, cards.type AS type, cards.subtype AS subtype, cards.swaps_to AS swaps_to
                FROM cards LEFT JOIN card_rarity_order
                ON cards.rarity = card_rarity_order.rarity_name
                ORDER BY 
                    card_rarity_order.rarity_order,
                    cards.name;
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
                    cards.id AS id, cards.name AS name,
                    cards.cost AS cost, cards.upgraded_cost AS upgraded_cost,
                    cards.description AS description, cards.upgraded_description AS upgraded_description,
                    cards.rarity AS rarity, cards.type AS type, cards.subtype AS subtype, cards.swaps_to AS swaps_to
                FROM cards LEFT JOIN card_rarity_order
                ON cards.rarity = card_rarity_order.rarity_name
                WHERE cards.id = ANY($1)
                ORDER BY 
                    card_rarity_order.rarity_order,
                    cards.name;
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
    },

    getAllNames: async function() {
        try {
            const statement = `
                SELECT id, name
                FROM cards
                ORDER BY name;
            `

            const result = await db.query(statement, []);
            if (result.rows?.length) {
                return result.rows;
            }
        } catch (error) {
            console.warn('error occured during card retrieval');
            throw(error);
        }
    }
}