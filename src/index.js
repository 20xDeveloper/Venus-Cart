const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const cartRouter = require('./routers/cart')
const productRouter = require('./routers/product')
const apiAdminRouter = require('./routers/apiAdmin')
const orderRouter = require('./routers/order')
const categoryRouter = require('./routers/category')
const cors = require('cors')

const auth = require("./middleware/auth")
const csrf = require('csurf');
const stripe = require('stripe')


const csrfProtection = csrf();
const app = express()
const port = process.env.PORT


const router = new express.Router()






//create your router for the stripe check out here because we don't want to use the csrfProtection
//so write the route handler here before line 18. we don't want to run that code first before
//our stripe checkout. it has its own csrf token. we will get an error. The code works from top to bottom.
//this router will not work on postman because we don't know how to send
//a stripe token. So, use this when you are actually ready to test.
router.post("/cart/purchased", auth, async (req, res) => {
  //this token is retrieved from front end form.
  //It's not an ordinary form. We got the code from the stripe documentation
  //when you submit that form which is the pop up dialog where you have to
  //enter your credit card information. Then it comes to our backend
  //and we process it. this token contains the user credit card information  
  const token = req.body.stripeToken

  //get the total price for all cart items
  let user = await req.user.populate('cart.items.productId').execPopulate()
  const products1 = user.cart.items
  let total = 0
  await products1.forEach(p => {
    total += p.quantity * p.productId.price; //need to look into this why we can access price in the productId property
  });

  //save the order in the database
  const products2 = await user.cart.items.map(i => {
    return { quantity: i.quantity, product: { ...i.productId._doc } };
  });
  const order = new Order({
    user: {
      email: req.user.email,
      userId: req.user
    },
    products: products2
  });
  await order.save();


  //Take the user money from the stripe token (stripe token = credit card information)
  const charge = stripe.charges.create({ //make sure you install the stripe module using npm install stripe and required the module in this file
    amount: totalSum * 100, //amount option is how much you are charging. the value in the amount property is in cents so you will have to multiply the value by 100
    currency: 'usd', //what currency you want th charge to be in
    description: 'Demo Order', //I don't know what this is you will have to read the documentation for it.
    source: token, //the token is the variable we defined earlier. it contains the stripe token we recieved from the form. this token contains the clients credit card information
    metadata: { order_id: result._id.toString() } //this is optional. i don't know what the meta data is i think it will display the order Id in the stripe admin dashboard. make sure you .toString() your order._id. also you should have a order collection in your api. profressional sites have the history of orders for each user saved in the database.
  });
  await req.user.clearCart(); //this is a instace model in the user model. it clears the cart because we just checkout our cart. so it should be empty now.

  res.send({ message: "Your order is on its way! We sent you a confirmation email." })

})

// uncomment the line below when you are ready to launch your api to production because we don't know how to send a csrf token from postman
// app.use(csrfProtection);

// Set up a whitelist and check against it:
// var whitelist = ['localhost:3000']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(cartRouter)
app.use(productRouter)
app.use(apiAdminRouter)
app.use(orderRouter)
app.use(categoryRouter)


app.listen(port, () => {
  console.log('Server is up on port ' + port)
})