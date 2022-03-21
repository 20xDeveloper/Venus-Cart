const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const Order = require('../models/order')
const router = new express.Router()


router.get("/orders", auth, async (req, res) => {
    const userOrders = await Order.find({ 'user.userId': req.user._id })
    res.send({ userOrders }) //used property short hand es6 syntax
 })
 





  module.exports = router

  




