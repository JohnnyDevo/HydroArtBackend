const router = require('express-promise-router');
const cardService = require('../../services/cards');
const artService = require('../../services/art');
const keywordService = require('../../services/keywords');
const checkCardId = require('./checkCardId');

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

//...can find all info relating to a card by ID
cardsRouter.get('/:cardID', checkCardId, async (req, res, next) => {
    const arts = artService.getAllByCardId(req.card.id);
    const defaultArtID = artService.getDefaultArtsByCardIds([req.card.id]);
    const keywords = keywordService.getAllByCardId(req.card.id);
    let swapsTo;
    if (req.card.swaps_to) {
        swapsTo = await cardService.getById(req.card.swaps_to);
        swapsTo.art = (await artService.getDefaultArtsByCardIds([swapsTo.id]))[0];
    }

    res.status(200).json({
        card: req.card,
        arts: await arts,
        defaultArtID: (await defaultArtID)[0].art_id,
        keywords: await keywords,
        swapsTo: swapsTo
    });
});

module.exports = cardsRouter;