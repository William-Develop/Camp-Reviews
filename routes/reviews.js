const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");  // Import Campground model.
const Review = require("../models/review");  // Import the Review model.

const { reviewSchema } = require("../schemas.js"); // schemas for reviews.

const ExpressError = require("../utilities/ExpressError");   // Import ExpressError class to create HTTP error objects.
const catchAsync = require("../utilities/catchAsync");   // catchAsync utility to catch rejected Promises in async functions.

// Middleware function to validate a review
const validateReview = (req, res, next) => {
    // Validate the request body against the review schema
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // Map through the error details and join them into a single string
        const message = error.details.map(element => element.message).join(",")
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

// POST route for adding reviews to a campground, validate the review data before processing
router.post("/", validateReview, 
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
router.delete("/:reviewId", 
    // Use catchAsync to catch any errors and pass them to the error handling middleware
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        // Find the campground by its id and remove the review from its reviews array
        await Campground.findByIdAndUpdate(id, { $pull:  {reviews: reviewId}})
        // Find the review by its id and delete it from the database
        await Review.findByIdAndDelete(req.params.reviewId);
        // Redirect the user to the campground's detail page
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;