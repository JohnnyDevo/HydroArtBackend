const loaders = require('./loaders');

async function startServer() {

    const app = await loaders.init();

    //app.listen
}

startServer();