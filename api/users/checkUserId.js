const userService = require('../../services/users');

module.exports = async function checkUserId(req, res, next) {
    try {
        const userID = req.params.userID;
        //todo: validate id here?
        if (userID) {
            const foundUser = await userService.findUser({ id: userID });
            if (foundUser) {
                req.foundUser = foundUser;
                return next();
            }
        }
        res.status(404).send();
    } catch (error) {    
        console.warn('error when searching for user');
        next(error);
    }
}