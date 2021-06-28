const artService = require('../../services/art');

module.exports = async function checkArtId(req, res, next) {
    try {
        const artID = req.params.artID;
        //todo: validate id here?
        if (artID) {
            const art = await artService.getById(artID);
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