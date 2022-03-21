const express = require('express')

const Shop = require('../models/shop')


const router = new express.Router()


router.post("/shop/add", async (req, res) => {
    const shop = new Shop({
        ...req.body
    })
    console.log(shop)
    try {
        await shop.save()
        res.status(201).send({shop})
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router
