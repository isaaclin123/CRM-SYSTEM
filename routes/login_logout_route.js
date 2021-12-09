const express = require("express");
const router = express.Router();
const userDao = require("../database/userDao.js");
const bcrypt = require ('bcrypt');
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/middleware.js");

/**
 * Render the log in page
 */
 router.get("/",function(req, res){
    if(res.locals.user){
        res.redirect("/myHomePage")
    }else{
        res.locals.message=req.query.message;
        res.render("login",{
            title:"Login page",
            jsFile:"loginPage",
            cssFile: "login"
        });
    } 
});

module.exports = router;