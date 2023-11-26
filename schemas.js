const Joi = require("joi");


// This code exports a Joi schema that validates a 'campground' object, ensuring it has required 'title', 'price', 'image', 'location', and 'description' properties.
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})