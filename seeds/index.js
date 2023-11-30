// Import necessary modules and data
const mongoose = require ("mongoose"); // Mongoose for MongoDB interactions
const cities = require("./cities"); // Data for cities
const {places, descriptors} = require("./seedHelpers"); // Helper data for seeding
const Campground = require("../models/campground"); // Campground model

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp", {});

// Set up connection to MongoDB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: ")); // Log any connection errors
db.once("open", () => {
    console.log("Database connected!"); // Log successful connection
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
        const price = Math.floor(Math.random() * 20) + 10; // Generate a random price for the campground
        // New instance campground of model saved to the database
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`, // Set location to a random city
            title: `${sample(descriptors)} ${sample(places)}`, // Generate a random title
            image: "https://source.unsplash.com/collection/483251", // Set image URL
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea inventore sit, eveniet harum, voluptates recusandae ducimus aliquid error quasi amet natus esse cum, cupiditate non a ullam unde. Provident, nihil.", // Set description
            price // Set price
        })
        await camp.save(); // Save the new campground to the database
    }
}

// Call seedDB and close the connection to MongoDB
seedDB().then(() => {
    mongoose.connection.close(); // Close the connection after seeding
})