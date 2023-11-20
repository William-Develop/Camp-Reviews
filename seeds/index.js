// Import necessary modules and data
const mongoose = require ("mongoose");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const Campground = require("../models/campground");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

// Set up connection to MongoDB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected!");
});

// Function to return a random element from an array
const sample = array => array[Math.floor(Math.random() * array.length)];

// Function to seed the database
const seedDB = async () => {
    // Delete all campgrounds
    await Campground.deleteMany({});
    // Create 50 new campgrounds
    for(let i = 0; i < 50 ; i ++) {
        // Generate a random index for cities array
        const random1000 = Math.floor(Math.random() * 1000);
        // Create new campground and save to database
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

// Call seedDB and close the connection to MongoDB
seedDB().then(() => {
    mongoose.connection.close();
})