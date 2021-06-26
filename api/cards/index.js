const router = require('express-promise-router');
const cardService = require('../../services/cards');

const cardsRouter = router(); //mounted to '/cards'

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

module.exports = cardsRouter;