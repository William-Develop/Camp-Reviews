// Function wraps another Express middleware to ensure asynchronous errors are forwarded to the next() function for handling.
module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next);
    }
}