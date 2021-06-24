const fs = require('fs');
const env = require('./config');
const loaders = require('./loaders');

async function startServer() {

    const app = loaders.init();

    let server;
    if (env.environment === 'production') {
        server = require('https').createServer(
            {
                key: fs.readFileSync(env.https.key),
                cert: fs.readFileSync(env.https.cert)
            },
            app
        );
    } else {
        server = require('http').createServer(app);
    }

    server.listen(env.port, () => {
        console.log(`The server is now listening on port ${env.port}.`);
    });

}

startServer();