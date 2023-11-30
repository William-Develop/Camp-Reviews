// Define a custom error class that extends the built-in Error class
class ExpressError extends Error {
    // The constructor accepts two parameters: a message and a status code
    constructor(message, statusCode) {
        super(); // Call the parent class's constructor
        this.message = message; // Set the error message
        this.statusCode = statusCode; // Set the HTTP status code
    }
}

// Export the custom error class for use in other parts of the application
module.exports = ExpressError;