require('dotenv').config();

module.exports = {
    port: process.env.EXPRESS_PORT,
    environment: process.env.HABDEV,
    https: {
        key: process.env.HTTPS_KEY,
        cert: process.env.HTTPS_CERT
    },
    secret: process.env.SESSION_SECRET
}