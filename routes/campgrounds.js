const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");   // Import the catchAsync utility to catch rejected Promises in async functions.
const { campgroundSchema } = require("../schemas.js"); // Import the schemas for campgrounds and reviews.

const ExpressError = require("../utilities/ExpressError");   // Import the ExpressError class to create HTTP error objects.
const Campground = require("../models/campground");  // Import the Campground model.

// Middleware to validate a campground
const validateCampground = (req, res, next) => {
    // Validate request body against the campground schema
    const { error } = campgroundSchema.validate(req.body);
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

// GET route for retrieving all campgrounds.
router.get("/", 
    // Use catchAsync to catch errors and pass them to the error handling middleware.
    catchAsync(async (req, res) => {
        // Find all campgrounds in the database
        const campgrounds =  await Campground.find({});
        // Render 'campgrounds/index' view and pass the campgrounds data to it.
        res.render("campgrounds/index", {campgrounds})
    })
);

// GET route for displaying the form to create a new campground.
router.get("/new", (req, res) => {
    // Render 'campgrounds/new' view which contains the form.
    res.render("campgrounds/new");
});

// Define a POST route for creating a new campground
router.post("/", 
    // Use validateCampground middleware to validate incoming data
    validateCampground, 
    // Use the catchAsync function to catch any errors and pass them to the error handling middleware
    catchAsync(async (req, res, next) => {
        // Create new Campground instance with the data from the request body
        const campground = new Campground(req.body.campground);
        // Save new campground to the database
        await campground.save();
        req.flash("success", "Successfully added a new campground!")
        // Redirect the client to the new campground's page
        res.redirect(`/campgrounds/${campground._id}`)
    })
);

// GET route for showing a specific campground
router.get("/:id", 
    // Use catchAsync catch errors and pass to error handling middleware
    catchAsync(async (req, res) => {
        // Find campground by id and populate its reviews
        const campground = await Campground.findById(req.params.id).populate("reviews");
        if(!campground) {
            req.flash("error", "Cannot find campground!")
            return res.redirect("/campgrounds");
        }
        // Render 'campgrounds/show' view and pass the campground data to it
        res.render("campgrounds/show", { campground });
    })
);

// GET route for displaying the form to edit a specific campground
router.get("/:id/edit", 
    // Use the catchAsync function to catch any errors and pass them to the error handling middleware
    catchAsync(async (req, res) => {
        // Find the campground by its id
        const campground = await Campground.findById(req.params.id)
        if(!campground) {
            req.flash("error", "Cannot find campground!")
            return res.redirect("/campgrounds");
        }
        // Render the 'campgrounds/edit' view and pass the campground data to it
        res.render("campgrounds/edit", { campground });
    })
);

// PUT route for updating a specific campground
router.put("/:id", 
    // Use the validateCampground middleware to validate the incoming data
    validateCampground, 
    // Use the catchAsync function to catch any errors and pass them to the error handling middleware
    catchAsync (async (req, res) => {
        // Destructure the id from the request parameters
        const { id } = req.params;
        // Find the campground by its id and update it with the data from the request body
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        req.flash("success", "Successfully updated campground!")
        // Redirect the client to the updated campground's page
        res.redirect(`/campgrounds/${campground._id}`)
    })
);

// DELETE route for removing a specific campground
router.delete("/:id", 
    // Use catchAsync to catch any errors and pass them to the error handling middleware
    catchAsync(async (req, res) => {
        // Destructure the id from the request parameters
        const { id } = req.params;
        // Find the campground by its id and delete it from the database
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted a campground!")
        // Redirect the client to the campgrounds page
        res.redirect("/campgrounds");
    })
);

module.exports = router;