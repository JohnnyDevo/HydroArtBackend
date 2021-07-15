const env = require('../config');

module.exports = {
    errorHandler: function(app) {
        app.use((err, req, res, next) => {
            if (env.environment === "development") {
                console.error(err);
                res.status(500).send(error);
            } else {
                res.status(500).send('Something went wrong');
            }
        });
    }
}