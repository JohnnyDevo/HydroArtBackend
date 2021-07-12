const comments = require('../../models/comments');

module.exports = {
    create: async function(category, comment, userID, cardID) {
        try {
            await comments.create(category, comment, userID, cardID);
        } catch (error) {
            console.warn("error during comments service");
            throw(error);
        }
    }
}