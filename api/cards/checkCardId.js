const cardService = require('../../services/cards');
const { param } = require("express-validator");

module.exports = async function checkCard(req, res, next) {
    try {
        param("cardID").whitelist('a-zA-Z:_').trim();
        if (req.params.cardID) {
            const cards = await cardService.getByIds([req.params.cardID]);
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