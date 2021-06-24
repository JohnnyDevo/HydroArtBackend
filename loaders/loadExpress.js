const express = require('express');
const env = require('../config');
const morgan = require('morgan');
const bodyParser = require('body-parser');

module.exports = {
    expressLoader: function() {
        const app = express();

        app.get('/status', (req, res) => { res.status(200).end(); });
        app.head('/status', (req, res) => { res.status(200).end(); });

        if (env.environment === 'development') {
            app.use(morgan('dev'));
        } else {
            app.use(morgan('tiny'));
        }

        app.use(bodyParser.urlencoded({ extended: true }));

        return app;
    }
}