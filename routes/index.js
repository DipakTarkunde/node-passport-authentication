const express = require("express")
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')

//Welcome
router.get("/", (req, res)=>{
    res.render("welcome")
})

//Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res)=>{
    
    //Printing the name of user from mongodb 
    if(req.user.displayName==null){
        res.render("dashboard", {
            name: req.user.name
        })
    }

    
    //Getting the name from google authenticator
    res.render("dashboard", {
        name: req.user.displayName
    })
})


module.exports = router;