const router = require('express-promise-router');
const cardService = require('../../services/cards');
const commentsService = require('../../services/comments');
const { body } = require('express-validator');
const validateUser = require('../users/validateUser');

const commentsRouter = router(); //mounted to '/comments'

//users...
//...can submit a comment
commentsRouter.post('/', 
    validateUser,
    body("cardID").whitelist('a-zA-Z:_').trim().optional(),
    (req, res, next) => {
        try {
            let card;
            if (req.body.cardID) {
                const cards = await cardService.getCardsByIds([req.body.cardID]);
                if (cards) {
                    card = cards[0];
                } else {
                    return res.status(404).send("card not found");
                }
            }
    
            if (!req.body.category) {
                return res.status(400).send("needs a category");
            }
    
            if (!req.body.comment) {
                return res.status(400).send("needs a comment body");
            }
            
            await commentsService.create(req.body.category, req.body.comment, req.user.id, card?.id);
            res.status(201).send("comment created");
        } catch (error) {
            console.warn("error when receiving a user comment");
            next(error);
        }
    }
);

module.exports = commentsRouter;