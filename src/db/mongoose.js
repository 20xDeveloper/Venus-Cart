const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, { //see this is how we access a environment variable from config directory and dev.env. i don't know if the directory and file name has to be called those. dev.env and config directory. Maybe look into it.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})