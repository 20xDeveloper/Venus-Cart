const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const router = new express.Router()


router.get("/cart", auth, async (req, res) => {
    let userCartItems = await req.user
     .populate('cart.items.productId')
     .execPopulate()
 
     res.send({ userCartItems: userCartItems.cart.items})
 })
 
 router.post("/cart/add", auth, async (req, res) => {
     const prodId = req.body.productId;
     let productToAdd = await Product.findById(prodId)
     await req.user.addToCart(productToAdd);
 
     res.send({message: "added to cart!"})
  })
 
  //removes a cart item.
  //client has to provide a productId to us. So, it should be a hidden field in
  //their front end form
  router.post("/cart/remove", auth, async (req, res) => {
     const prodId = req.body.productId;
     await req.user.removeFromCart(prodId)
     res.send({message: "you have successfully removed a cart item"})
 
  })
 
 
  //checking out of the cart
  //it will give you the total cost
  router.get("/cart/checkout", auth, async (req, res) => {
    let user = await req.user.populate('cart.items.productId').execPopulate()
     const products = user.cart.items
     let total = 0
     products.forEach(p => {
         total += p.quantity * p.productId.price; //need to look into this why we can access price in the productId property
     });
     res.send({ total })
  })






  module.exports = router

  