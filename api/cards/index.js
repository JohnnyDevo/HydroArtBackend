const router = require('express-promise-router');
const cardService = require('../../services/cards');
const artService = require('../../services/art');
const keywordService = require('../../services/keywords');
const checkCardId = require('./checkCardId');
const { query } = require('express-validator');

const cardsRouter = router(); //mounted to '/cards'

//Anyone...
//...can retrieve a list of cards
cardsRouter.get('/', async (req, res, next) => {
    try {
        const cards = await cardService.getAll();
        res.status(200).json(cards);
    } catch (error) {
        console.warn('error occured when getting cards from card service');
        next(error);
    }
});

//...can find a list of cards matching a search string
cardsRouter.get('/search', query('search').whitelist('a-zA-Z'), async (req, res, next) => {
    try {
        let cards;
        if (req.query.search) {
            cards = await cardService.search(req.query.search);
        } else {
            cards = await cardService.getAll();
        }
        cards.search_string = req.query.search;
        res.status(200).json(cards);
    } catch (error) {
        console.warn('error when searching for cards');
        next(error);
    }
});

//...can find all info relating to a card by ID
cardsRouter.get('/:cardID', checkCardId, async (req, res, next) => {
    try {
        const arts = artService.getAllByCardId(req.card.id);
        const defaultArt = await artService.getDefaultArtsByCardIds([req.card.id]);
        let defaultArtId;
        if (defaultArt) {
            defaultArtId = defaultArt[0].id;
        }
        const keywords = keywordService.getAllByCardId(req.card.id);
        let swapsTo;
        if (req.card.swaps_to) {
            swapsTo = (await cardService.getByIds([req.card.swaps_to]))[0];
            const art = await artService.getDefaultArtsByCardIds([swapsTo.id]);
            if (art) {
                swapsTo.art = art[0];
            }
        }
    
        res.status(200).json({
            card: req.card,
            arts: await arts,
            defaultArtID: defaultArtId,
            keywords: await keywords,
            swapsTo: swapsTo
        }); 
    } catch (error) {
        console.warn('error occured when retrieving card information');
        next(error);
    }
});

//...can retrieve a list of all card names
cardsRouter.get('/names', async (req, res, next) => {
    try {
        const cards = await cardService.getAllNames();
        res.status(200).json(cards);
    } catch (error) {
        console.warn('error occured when retrieving card information');
        next(error);
    }
});

module.exports = cardsRouter;