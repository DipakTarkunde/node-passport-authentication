const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const AmazonStrategy = require('passport-amazon').Strategy

//Load user model
const User = require("../models/User");


module.exports = function(passport) {
    //for google authentication
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback:true 
    },function(request, accessToken, refreshToken, profile, done){
        console.log(profile)
        return done(null, profile)
    }
    ))


    //for Facebook authentication
    passport.use(new FacebookStrategy({
        clientID:process.env.FACEBOOK_CLIENT_ID,
        clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL:process.env.FACEBOOK_CALLBACK_URL,
    },function (accessToken, refreshToken, profile, done){
        console.log(profile);
        return done(null, profile); 
    }
    ));


    //For Amazon authentication
    passport.use(new AmazonStrategy({
        clientID:process.env.AMAZON_CLIENT_ID,
        clientSecret:process.env.AMAZON_CLIENT_SECRET,
        callbackURL:process.env.AMAZON_CALLBACK_URL,
    }, function (accessToken, refreshToken, profile, done){
        return done(null, profile);
    }
    ))


    //For registered user authentication using mongodb
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match user
            User.findOne({ email: email })
                .then(user => {
                    if(!user){
                        return done(null, false, { message:"The email is not registered" });
                    }

                    // Password match
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch){
                            return done(null, user);
                        }else{
                            return done(null, false, { message: "Incorrect password" })
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    );

    //New one
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
    passport.deserializeUser(function(user, done) {
        return done(null, user);
    });

    //Old one 
    //passport.serializeUser((user, done) => {
    //    done(null, user.id);
    //  });
      
    //  passport.deserializeUser((id, done) => {
    //    User.findById(id, (err, user) => {
    //      done(err, user);
    //    });
    //  });
}