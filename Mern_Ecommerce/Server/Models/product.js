const mongoose = require("mongoose")
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "please Enter product description"],
    },
    price: {
        type: Number,
        required: [true, "please Enter Product Price"],
        maxLength: [8, "Price cannot exceed 8 chracters"],
    },
    rating: {
        type: Number,
        default: 0,
    },
    image: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
    ],
    category: {
        type: String,
        required: true
    },
    Stock: {
        type: Number,
        required: [true, "please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    
    createdAT: {
        type: Date,
        default: Date.now
    }
})
const Product = mongoose.model("Product", productSchema)
module.exports = Product;