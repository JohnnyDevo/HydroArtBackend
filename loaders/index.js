const { expressLoader } = require('./loadExpress');
const { authLoader } = require('./loadAuth');
const { sessionLoader } = require('./loadSession');
const { routesLoader } = require('./loadRoutes');

module.exports = {
    init: function() {
        const app = expressLoader();
        console.log('Express Initialized');

        sessionLoader(app);
        console.log('Sessions Initialized');

        authLoader(app);
        console.log('Authorization Initialized');

        routesLoader(app);
        console.log('Routes Initialized');

        return app;
    }
}