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
    }
}