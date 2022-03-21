const express = require('express')
const auth = require('../middleware/auth')
const Product = require('../models/product')
const Shop = require('../models/shop')


const router = new express.Router()


//if you want to use my api you have to provide the cartType Id I give
//you and put that value when you send your request to get all the products
//for your specific shopping cart
router.get("/products/:name", async (req, res) => {
let shopName = req.params.name //get the value of the key and store it
console.log("here is the request params", shopName)

// console.log("this is the shop name", shopName)
let whichSite = await Shop.findOne({ name: shopName })
// console.log("this is the site we want to access", whichSite)
let siteProducts = await whichSite.populate('products').execPopulate()

res.send({ siteProducts: siteProducts.products }) //we are using property short hand syntax here.


})

//adding a product
router.post("/products/add", async (req, res) => {

  const product = await new Product({
    // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    stock: req.body.stock,
    sku: req.body.sku,
    // imageUrl: imageUrl,
    categoryId: req.body.categoryId,
    shopId: req.body.shopId
  });

  await product.save()

  res.send({ message: "we successfully added a product to the shop!" })

})

//adding a product
router.post("/products/update", async (req, res) => {

  let productToUpdate = await Product.findById(req.body.productId)
  productToUpdate._id = req.body.productId;
  productToUpdate.name = req.body.name;
  productToUpdate.price = req.body.price;
  productToUpdate.stock = req.body.stock;
  productToUpdate.sku = req.body.sku;

  //   image = req.file;
  productToUpdate.description = req.body.description;

  await productToUpdate.save()

  res.send({ message: "you have successfully updated a product!" })
})

//delete a product
router.delete("/products/:id", async (req, res) => {
  const prodId = req.params.id;
  console.log(prodId)
  //check if the product exist
  let productToDelete = await Product.findById(prodId)
  if (!productToDelete) {
    res.send({ error: "product not found." })
  }

  //delete the product
  await Product.deleteOne({ _id: prodId });
  res.send({ message: "you have deleted a product successfully!" })

})



module.exports = router
