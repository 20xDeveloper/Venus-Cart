const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
        type: String,
        default: "this product does not have a sku"
    },
    imageUrl: {
        type: String
        // required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema) //btw the second argument for model of the mongoose object you usually pass an object which is litterally the value of the mongoose schema. we use to do it like that in the first weeks of this course but we don't anymore because this is the better way we have access to more features. to see how we did it the old way look at the previous weeks. like the first couple of weeks of the course. you will get a better understanding of how everything works. 

module.exports = Product