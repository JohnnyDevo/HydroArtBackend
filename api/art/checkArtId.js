const artService = require('../../services/art');
const { param } = require("express-validator");

module.exports = async function checkArtId(req, res, next) {   
    try {
        param("artID").toInt();
        if (req.params.artID) {
            const art = await artService.getById(req.params.artID);
            if (art) {
                req.art = art;
                return next();
            }
        }
        res.status(404).send();
    } catch (error) {    
        console.warn('error when searching for art');
        next(error);
    }
}