const cardsRouter = require("../api/cards");
const usersRouter = require("../api/users");
const artRouter = require("../api/art");
const commentsRouter = require("../api/comments");

module.exports = {
    routesLoader: function(app) {
        app.use('/users', usersRouter);
        app.use('/cards', cardsRouter);
        app.use('/art', artRouter);
        app.use('/comments', commentsRouter);
    }
}