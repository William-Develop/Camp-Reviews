// This module exports a function that takes another function (func) as an argument.
// This is useful for passing errors to error-handling middleware in Express.js
module.exports = func => {
    // It returns a new function that takes three arguments: req, res, and next
    return(req, res, next) => {
        // It calls the original function (func) with req, res, and next as arguments
        // If the original function returns a Promise that rejects, it calls next with the reason for rejection
        func(req, res, next).catch(next);
    }
}