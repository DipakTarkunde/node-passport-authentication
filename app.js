require('dotenv').config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const cookieSession = require('cookie-session')
const favicon = require('serve-favicon') 
const path = require('path') 
const { profile } = require('console')


const app = express();   

//Favicon icon Middleware  
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); 

//Passport config
require("./config/passport")(passport); 

//Passport for google-auth
//require('./passport-setup');

//app.use(cookieSession({
//    name: 'tuto-session',
//    keys: ['key1', 'key2']
//}))

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodypardser
app.use(express.urlencoded({ extended: false })); 

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));



// Auth middleware that checks if the user is logged in
//const isLoggedIn = (req, res, next) => {
//    if (req.user) {
//        next();
//    } else {
//        res.sendStatus(401);
//    }
//}

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



//Google-Auth routes 
app.get('/google', passport.authenticate('google', {scope:['profile','email']}));
app.get('/google/callback',passport.authenticate('google',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login'
    }
));



//Facebook-Auth routes
app.get('/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}));
app.get('/facebook/callback', 
    passport.authenticate('facebook', {
        successRedirect:'/dashboard',
        failureRedirect:'/users/login'
    }
));


app.get('/success', (req, res)=>{
    res.send('Success!')
})

//Amazon-Auth routes
app.get('/amazon', passport.authenticate('amazon', { scope: ['profile']}));
app.get('/amazon/callback',
    passport.authenticate('amazon', {
        failureRedirect:'/users/login' 
    }),
    function (req, res) {
        res.redirect('/dashboard');
    }
);

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


const PORT =  process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));