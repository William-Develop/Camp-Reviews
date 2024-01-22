// Import necessary modules
const express = require("express");    // Import the express module to create the server. 
const path = require("path");   // Import the path module to handle and transform file paths.
const mongoose = require ("mongoose");  // Import the mongoose module to interact with MongoDB.
const ejsMate = require('ejs-mate');    // Import the ejs-mate module for layout support in EJS templates.
const { campgroundSchema, reviewSchema } = require("./schemas.js"); // Import the schemas for campgrounds and reviews.
const catchAsync = require("./utilities/catchAsync");   // Import the catchAsync utility to catch rejected Promises in async functions.
const ExpressError = require("./utilities/ExpressError");   // Import the ExpressError class to create HTTP error objects.
const methodOverride = require("method-override");  // Import the method-override module to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
const Campground = require("./models/campground");  // Import the Campground model.
const Review = require("./models/review");  // Import the Review model.

const campgrounds = require("./routes/campgrounds");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

// Set up connection to MongoDB
const db = mongoose.connection;
// Bind an event listener to the 'error' event on the connection object
// This will log any errors that occur during the connection
db.on("error", console.error.bind(console, "connection error: "));
// Bind an event listener to the 'open' event on the connection object.
// This will run once when the connection is open
db.once("open", () => {
    console.log("Database connected!");
});

// Initialize Express app
const app = express();

// Set EJS template engine using ejsMate enhanced features
app.engine("ejs", ejsMate);
// Set view engine to EJS
app.set("view engine", "ejs");
// Set views directory
app.set("views", path.join(__dirname, "views"));

// Use middleware for parsing request bodies
// The "extended: true" allows for rich objects/arrays to be encoded into URL-encoded format, allowing for a JSON-like experience.
app.use(express.urlencoded({extended: true}));
// Middleware to allow for HTTP verbs like PUT or DELETE where the client doesn't support it.
app.use(methodOverride("_method"));



// Middleware function to validate a review
const validateReview = (req, res, next) => {
    // Validate the request body against the review schema
    const { error } = reviewSchema.validate(req.body);
    // If there is an error in validation
    if (error) {
        // Map through the error details and join them into a single string
        const message = error.details.map(element => element.message).join(",")
        // Throw an ExpressError with the error message and a status of 400
        throw new ExpressError(message, 400)
    } else {
        // If there is no error, proceed to the next middleware function
        next();
    }
}

app.use("/campgrounds", campgrounds);

// Route for homepage
app.get("/", (req, res) => {
    // Render the 'home' view when the homepage is accessed.
    res.render("home")
});

// POST route for adding reviews to a campground, validate the review data before processing
app.post("/campgrounds/:id/reviews", validateReview, 
    // Use catchAsync to catch any errors and pass them to the error handling middleware
    catchAsync(async (req, res) => {
        // Find the campground by its id
        const campground = await Campground.findById(req.params.id);
        // Create a new review from the request body
        const review = new Review(req.body.review);
        // Add the new review to the campground's reviews array
        campground.reviews.push(review);
        // Save the new review to the database
        await review.save();
        // Save the updated campground to the database
        await campground.save();
        // Redirect the user to the campground's detail page
        res.redirect(`/campgrounds/${campground._id}`);
    })
)


// DELETE route for removing a review from a campground
app.delete("/campgrounds/:id/reviews/:reviewId", 
    // Use catchAsync to catch any errors and pass them to the error handling middleware
    catchAsync(async (req, res) => {
        // Destructure the id of the campground and the review from the request parameters
        const { id, reviewId } = req.params;
        // Find the campground by its id and remove the review from its reviews array
        await Campground.findByIdAndUpdate(id, { $pull:  {reviews: reviewId}})
        // Find the review by its id and delete it from the database
        await Review.findByIdAndDelete(req.params.reviewId);
        // Redirect the user to the campground's detail page
        res.redirect(`/campgrounds/${id}`);
    })
);


// Define a catch-all route that matches any path for all HTTP methods
app.all("*", (req, res, next) => {
    // Pass a new ExpressError to the next middleware function
    // This will be caught by the error handling middleware and send a 404 error with the message "Page Not Found!"
    next(new ExpressError("Page Not Found!", 404))
});

// Define the error handling middleware
app.use((err, req, res, next) => {
    // Destructure the status code from the error object, defaulting to 500 if it's not set
    const {statusCode = 500 } = err;
    // If the error doesn't have a message, set a default message
    if(!err.message) err.message = "Something went wrong!"
    // Set the response status code and render the 'error' view, passing the error object to it
    res.status(statusCode).render("error", {err})
})

// Start the server
app.listen(3000, () => {
    console.log("Server started on port: 3000")
});
