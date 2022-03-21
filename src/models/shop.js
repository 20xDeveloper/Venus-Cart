const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

shopSchema.virtual('products', {
    ref: 'Product', //I think it has to match of the model name you imported to this file or just has to exist in the database.
    localField: '_id',
    foreignField: 'shopId'
})

shopSchema.virtual('categories', {
    ref: 'Category', //I think it has to match of the model name you imported to this file or just has to exist in the database.
    localField: '_id',
    foreignField: 'shopId'
})

const Shop = mongoose.model('Shop', shopSchema) //btw the second argument for model of the mongoose object you usually pass an object which is litterally the value of the mongoose schema. we use to do it like that in the first weeks of this course but we don't anymore because this is the better way we have access to more features. to see how we did it the old way look at the previous weeks. like the first couple of weeks of the course. you will get a better understanding of how everything works. 

module.exports = Shop