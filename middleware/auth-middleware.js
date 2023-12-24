const ApiError = require('../error/api-error');
const tokenService = require('../service/token-service');

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log('__authorizationHeader__', authorizationHeader)

        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        console.log('__accessToken__', accessToken)

        if(!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        console.log('__userData__', userData)

        if(!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch(e) {
        return next(ApiError.UnauthorizedError());
    }
}