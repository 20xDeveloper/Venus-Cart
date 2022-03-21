const express = require('express')
const multer = require('multer')
// const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/sendEmail')
const router = new express.Router()

//create an account api endpoint
//also create a shopping cart
router.post('/users', async (req, res) => {
    //the client will provide the cartTypeId as a hidden field in the form
    //the user pretty much has to provide what is in the model. or they will get an error. remember we used
    //validation.
    const user = new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name) //when the user creates a new account they will get a welcome email. we don't use await because it can come after he signed up like 2 minutes later it really doesn't matter and thats the way it is for most sites and apps.
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//login the user and generate an auth token for the user to perform authenticated actions.
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send( {invalid: "The credentials you entered was invalid."})
    }
})

//logout the user and remove that specific token. reason we have an array of tokens is because each one is for each device that user log in with. so one can be the desktop the other could be from his tablet or phone.
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//logs out all the user from any device. like desktop, tablet etc. this is good for when you deleted an user account.
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//get the user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//update the user profile and remember we know who "me" is because we made sure they had a token. look at the auth middleware file to get a better understanding of this route handler
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//if the user wants to delete the account
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name) //when a user wants to delete his account thats what this route handler is doing. remember req.user value was set in the auth middle ware. then it was passed down to this route handler call back function which was the next argument. look at the auth middleware to get a better understanding. look at line 15 to see req.user value being set.
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router