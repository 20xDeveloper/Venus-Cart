const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    admin: {
        type: Boolean,
        default: false
    },
    birthday: {
        type: Date
        // validate(value) {
        //     if (value < 0) {
        //         throw new Error('Age must be a postive number')
        //     }
        // }
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Shop'
        // validate(value) {
        //     if (value < 0) {
        //         throw new Error('Age must be a postive number')
        //     }
        // }
    },
    cart: {
        items: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: true
            },
            quantity: { type: Number, required: true }
          }
        ]
      },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})



//when ever you send back information to the client you will always exclude password and tokens. .toJSON is when ever you json.strifigiy and node.js does it behind the scenes when ever you pass data to the client
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//I got this instance method from max project
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };

  //this instance method clears the cart. used when finishing checking out
  userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };

  //this instance method removes a cart item
  //the key word this is refferring to the instance of the model object
  //user model has a cart field
  userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  };

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving. pretty much when ever you save in the program.
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user shopping cart when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await ShoppingCart.deleteMany({ userId: user._id })
    next()
})

const User = mongoose.model('User', userSchema) //btw the second argument for model of the mongoose object you usually pass an object which is litterally the value of the mongoose schema. we use to do it like that in the first weeks of this course but we don't anymore because this is the better way we have access to more features. to see how we did it the old way look at the previous weeks. like the first couple of weeks of the course. you will get a better understanding of how everything works. 

module.exports = User