const cardsRouter = require("../api/cards");
const usersRouter = require("../api/users");
const artRouter = require("../api/art");

module.exports = {
    routesLoader: function(app) {
        app.use('/users', usersRouter);
        app.use('/cards', cardsRouter);
        app.use('/art', artRouter);
    }
}