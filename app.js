// Import necessary modules
const express = require("express");
const path = require("path");
const mongoose = require ("mongoose");
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

// Set view engine to EJS
app.set("view engine", "ejs");
// Set views directory
app.set("views", path.join(__dirname, "views"));

// Use middleware for parsing request bodies and overriding HTTP methods
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Define route for homepage
app.get("/", (req, res) => {
    res.render("home")
});

// Define route for getting all campgrounds
app.get("/campgrounds", async (req, res) => {
    const campgrounds =  await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
});

// Define route for new campground form
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// Define route for creating a new campground
app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
});

// Define route for showing a specific campground
app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", { campground });
});

// Define route for editing a specific campground
app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground });
})

// Define route for updating a specific campground
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
})

// Define route for deleting a specific campground
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

// Start the server
app.listen(3000, () => {
    console.log("Server started on port: 3000")
});
