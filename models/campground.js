// Import the mongoose module to interact with MongoDB
const mongoose = require ("mongoose");

// Import the Review model to use in the post middleware
const Review = require("./review");

// Destructure Schema from mongoose to create schemas for our models
const Schema = mongoose.Schema;

// Define a new Schema for Campground
const CampgroundSchema = new Schema ({
    title: String,       // The title of the campground
    image: String,       // The image URL of the campground
    price: Number,       // The price of the campground
    description: String, // The description of the campground
    location: String,    // The location of the campground
    reviews: [           // An array of review IDs associated with the campground
        {
            type: Schema.Types.ObjectId, // The type is an ObjectId
            ref: "Review"                // The reference is the Review model
        }
    ]
});

// Middleware that runs after a campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (document) {
    if(document){
        // If the document exists, delete all reviews associated with it
        await Review.deleteMany ({
            _id: {
                $in: document.reviews // The condition is that the review's ID is in the document's reviews array
            }
        })
    }
})

// Export the Campground model using the CampgroundSchema
// This model can be used to interact with the 'campgrounds' collection in the database
module.exports = mongoose.model("Campground", CampgroundSchema);