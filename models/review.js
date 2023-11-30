// Import mongoose module, provides a straight-forward, schema-based solution to model the application data
const mongoose = require ("mongoose");

// Destructuring Schema from mongoose
const Schema = mongoose.Schema;

// Creating a new Schema for reviews. Each review will have a body (text) and a rating (number)
const reviewSchema = new Schema({
    body: String,
    rating: Number,
});

// Exporting the Review model, which can be used in other parts of our application
module.exports = mongoose.model("Review", reviewSchema);