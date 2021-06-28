const cardService = require('../../services/cards');

module.exports = async function checkCard(req, res, next) {
    try {
        const cardID = req.params.cardID;
        //todo: validate id here?
        if (cardID) {
            const card = await cardService.getById(cardID);
            req.card = card;
            next();
        } else {
            res.status(404).send();
        }
    } catch (error) {    
        console.warn('error when searching for cards');
        next(error);
    }
}