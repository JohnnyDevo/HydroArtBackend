const db = require('./');

module.exports = {

    create: async function(category, comment, userID, cardID) {
        try {

            const statement = `
                INSERT INTO comments
                VALUES (DEFAULT, $1, $2, $3, $4);
            `
            const parameters = [category, comment, userID, cardID];
            await db.query(statement, parameters);
        } catch (error) {
            console.warn('error occured during comment creation');
            throw(error);
        }
    }
}