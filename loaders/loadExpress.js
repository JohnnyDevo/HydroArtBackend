const express = require('express');
const env = require('../config');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = {
    expressLoader: function() {
        const app = express();

        app.get('/status', (req, res) => { res.status(200).end(); });
        app.head('/status', (req, res) => { res.status(200).end(); });

        const corsOptions = {
            optionsSuccessStatus: 200,
            credentials: true
        };
        if (env.environment === 'development') {
            app.use(morgan('dev'));
            corsOptions.origin = 'http://localhost';
        } else {
            app.use(morgan('tiny'));
            corsOptions.origin = 'https://johnnydevo.me';
        }
        app.use(cors(corsOptions));

        app.use(bodyParser.urlencoded({ extended: true }));

        return app;
    }
}