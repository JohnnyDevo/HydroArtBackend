const cardService = require('../../services/cards');

module.exports = async function checkCard(req, res, next) {
    try {
        const cardID = req.params.cardID;
        //todo: validate id here?
        if (cardID) {
            const cards = await cardService.getByIds([cardID]);
            if (cards) {
                req.card = cards[0];
                return next();
            }
        }
        res.status(404).send();
    } catch (error) {    
        console.warn('error when searching for card');
        next(error);
    }
}