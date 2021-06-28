const cardService = require('../../services/cards');

module.exports = async function checkCard(req, res, next) {
    try {
        const cardID = req.params.cardID;
        //todo: validate id here?
        if (cardID) {
            const card = await cardService.getById(cardID);
            if (card) {
                req.card = card;
                return next();
            }
        }
        res.status(404).send();
    } catch (error) {    
        console.warn('error when searching for card');
        next(error);
    }
}