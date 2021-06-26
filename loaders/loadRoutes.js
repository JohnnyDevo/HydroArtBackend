const cardsRouter = require("../api/cards");
const usersRouter = require("../api/users")

module.exports = {
    routesLoader: function(app) {
        app.use('/users', usersRouter);
        app.use('/cards', cardsRouter);
    }
}