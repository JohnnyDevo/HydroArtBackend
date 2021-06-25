const usersRouter = require("../api/users")

module.exports = {
    routesLoader: function(app) {
        app.use('/users', usersRouter);
    }
}