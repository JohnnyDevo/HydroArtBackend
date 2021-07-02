const router = require('express-promise-router');
const artService = require('../../services/art');
const cardService = require('../../services/cards');
const validateUser = require('../users/validateUser');
const checkCardId = require('../cards/checkCardId');
const checkUserId = require('../users/checkUserId');
const checkArtId = require('../art/checkArtId');
const { acceptFile, interpretFile } = require('../../services/acceptImage');

const artRouter = router(); //mounted to '/art'. 

//Anyone...
//...can retrieve all art info
artRouter.get('/', async (req, res, next) => {
    try {
        const allArt = await artService.getAll();
        res.status(200).json(allArt);
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//...can retrieve art info by info ID
artRouter.get('/:artID', checkArtId, async (req, res, next) => {
    res.status(200).json(req.art);
});

//...can retrieve all art info by card ID
artRouter.get('/cards/:cardID', checkCardId, async (req, res, next) => {
    try {
        const allArt = await artService.getAllByCardId(req.card.id);
        res.status(200).json(allArt);
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//...can retrieve all art info by artist ID
artRouter.get('/users/:userID', checkUserId, async (req, res, next) => {
    try {
        const allArt = await artService.getAllArtsByUserId(req.foundUser.id);
        res.status(200).json(allArt);
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//...can retrieve a list of all artists and how many pieces they've contributed
artRouter.get('/users', (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when getting artist info');
        next(error);
    }
});

//...can retrieve all art info by card ID *and* artist ID
artRouter.get('/cards/:cardID/users/:userID', checkCardId, checkUserId, async (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//Users...
//...can submit a new art piece
artRouter.post('/', validateUser, acceptFile.single('submission'), interpretFile, async (req, res, next) => {
    try {
        if (!req.body.cardID) {
            return res.status(401).send();
        }
        const card = await cardService.getByIds([req.body.cardID]);
        if (!card) {
            return res.status(404).send();
        }
        const art = await artService.create(req.body.cardID, req.user.id, req.file);
        if (art) {
            res.status(201).send(art);
        } else {
            console.warn('error occured when processing art');
            next(new Error());
        }
    } catch (error) {
        console.warn('error occured when submitting art');
        next(error);
    }
});

//Art owners...
//...can delete an art piece by ID
artRouter.delete('/:artID', validateUser, checkArtId, async (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when deleting art');
        next(error);
    }
});

module.exports = artRouter;