// Import necessary modules
const express = require("express");
const path = require("path");
const mongoose = require ("mongoose");
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require("./schemas.js");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

// Set up connection to MongoDB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
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

// Use middleware for parsing request bodies and overriding HTTP methods
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Middleware function that validates the request body against the 'campgroundSchema', and throws a custom error with a status code of 400 and a message containing validation error details if validation fails.
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",")
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

// Define route for homepage
app.get("/", (req, res) => {
    res.render("home")
});

// Define route for getting all campgrounds
app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds =  await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
}));

// Define route for new campground form
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// Route creates a new campground in the database using the data from the request body, and then redirects the client to the new campground's page.
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Define route for showing a specific campground
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", { campground });
}));

// Define route for editing a specific campground
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground });
}));

// Define route for updating a specific campground
app.put("/campgrounds/:id", validateCampground, catchAsync (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Define route for deleting a specific campground
app.delete("/campgrounds/:id", catchAsync (async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

// Catch-all route in Express that sends a custom "Page Not Found!" error with a 404 status code for any requests to non-existing routes.
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404))
})

// Error handling middleware that sends a response with the error's status code and message
app.use((err,req, res, next) => {
    const {statusCode = 500 } = err;
    if(!err.message) err.message = "Something went wrong!"
    res.status(statusCode).render("error", {err})
})

// Start the server
app.listen(3000, () => {
    console.log("Server started on port: 3000")
});
