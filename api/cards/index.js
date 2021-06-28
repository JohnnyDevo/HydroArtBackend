const router = require('express-promise-router');
const cardService = require('../../services/cards');

const cardsRouter = router(); //mounted to '/cards'

cardsRouter.param('cardID', async (req, res, next, id) => {
    try {
        const cardID = id;
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
});

cardsRouter.get('/', async (req, res, next) => {
    try {
        const cards = await cardService.getAll();
        res.status(200).json(cards);
    } catch (error) {
        console.warn('error occured when getting cards from card service');
        next(error);
    }
});

cardsRouter.get('/search', async (req, res, next) => {
    try {
        const search_string = req.query.search;
        //todo: validate search string here?
        let cards;
        if (search_string) {
            cards = await cardService.search(search_string);
        } else {
            cards = await cardService.getAll(search_string);
        }
        res.status(200).json(cards);
    } catch (error) {
        console.warn('error when searching for cards');
        next(error);
    }
});

cardsRouter.get('/:cardID', async (req, res, next) => {
    res.status(200).json(req.card);
});

module.exports = cardsRouter;