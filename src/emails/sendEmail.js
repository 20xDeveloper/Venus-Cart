const sgMail = require('@sendgrid/mail') //module we installed make sure you install it.

//btw we are using one of the environment variable from the dev.env file in the config directory. it's SENDGRID_API_KEY BTW its a convention to have all capitals for environment variables and no camel casing instead we just separate the word with underscore.
sgMail.setApiKey(process.env.SENDGRID_API_KEY) //before you do anything you have to set the api key or the api will not give you a response. it wont know who you are and if you even made an account with them. btw this is a professional email thing because they ask for the company name and all that good stuff.

const sendWelcomeEmail = (email, name) => { //we created a function because we are going to export it for it to be used any where in oru application
    sgMail.send({
        to: email, //email the parameter we got from the function which is from the user where ever we called this function it will make sense when you see it in action
        from: 'andrew@mead.io', //from the company which is us
        subject: 'Thanks for joining in!', //subject
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.` //plain text you have to use back tic ` and wrap that with the text if you want to use es6 built in template engine. so you can display variables like name to create a peronalization with the user. also its been proven the open rates are higher with no design because it shows its from a real person then a robot or over kill marketer.
    })
}

const sendCancelationEmail = (email, name) => { //when someone cancels the subscription 
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.` //by the way there is an html property where you can create your own html page for the email to design the way you want it to make it look fancy. you can use inline css style to make it look more fancy. or link your external css file.
    })
}

//we are exporting the two functions we created.
module.exports = {
    sendWelcomeEmail, 
    sendCancelationEmail
}