const router = require('express-promise-router');
const validateUser = require('../users/validateUser');
const checkCardId = require('../cards/checkCardId');
const checkUserId = require('../users/checkUserId');
const acceptImage = require('../../services/acceptImage');

const artRouter = router(); //mounted to '/art'. 

//Anyone...
//...can retrieve all art info
artRouter.get('/', (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//...can retrieve art info by info ID
artRouter.get('/:artID', checkArtId, (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//...can retrieve all art info by card ID
artRouter.get('/cards/:cardID', checkCardId, (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//...can retrieve all art info by artist ID
artRouter.get('/users/:userID', checkUserId, (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//...can retrieve all art info by card ID *and* artist ID
artRouter.get('/cards/:cardID/users/:userID', checkCardId, checkUserId, (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when getting art info');
        next(error);
    }
});

//Users...
//...can submit a new art piece
artRouter.post('/', validateUser, acceptImage, (req, res, next) => {
    try {
        //for now, we aren't doing anything with the image yet.
    } catch (error) {
        console.warn('error occured when submitting art');
        next(error);
    }
});

//Art owners...
//...can delete an art piece by ID
artRouter.delete('/:artID', validateUser, checkArtId, (req, res, next) => {
    try {
        
    } catch (error) {
        console.warn('error occured when deleting art');
        next(error);
    }
});

module.exports = artRouter;