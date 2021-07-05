const userService = require('../../services/users');
const { param } = require("express-validator");

module.exports = async function checkUserId(req, res, next) {
    try {
        param("userID").toInt();
        if (req.params.userID) {
            const foundUser = await userService.findUser({ id: req.params.userID });
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