const errorHandler = (error, req, res, next) => {
    return res.status(400).json(error.message);
};

const tokenExtractor = (req, res, next) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        req.token = authorization.substring(7);
    } else {
        req.token = null;
    }
    next();
};
module.exports = { errorHandler, tokenExtractor };
