// Import mongoose module
const mongoose = require ("mongoose");
const Review = require("./review");
// Destructure Schema from mongoose
const Schema = mongoose.Schema;

// Define a new Schema for Campground
const CampgroundSchema = new Schema ({
    title: String,       // Title of the campground
    image: String,
    price: Number,       // Price of the campground
    description: String, // Description of the campground
    location: String,     // Location of the campground
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

CampgroundSchema.post("findOneAndDelete", async function (document) {
    if(document){
        await Review.deleteMany ({
            _id: {
                $in: document.reviews
            }
        })
    }
})

// Export the Campground model using the CampgroundSchema
module.exports = mongoose.model("Campground", CampgroundSchema);