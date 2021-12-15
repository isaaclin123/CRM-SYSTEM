const express = require("express");
const router = express.Router();
const userDao = require("../database/userDao.js");
const bcrypt = require ('bcrypt');
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/middleware.js");
const sanitizeHtml = require('sanitize-html');

/**
 * Render the log in page
 */
 router.get("/",function(req, res){
    if(res.locals.user){
        res.redirect("/home")
    }else{
        res.locals.message=req.query.message;
        res.clearCookie("authToken");
        res.render("login",{
            title:"Login page",
            jsFile:"loginPage",
            cssFile: "login"
        });
    } 
});

/**
 * Receive username and password and compare password with hashpassword that stored in the database
 */
 router.post("/app/login",async function(req,res){
    const username=sanitizeHtml(req.body.username);
    const password=sanitizeHtml(req.body.password);
    let hash =await userDao.retrieveHashByUsername(username);
    if(hash==undefined){
        hash={hashPassword:0};
    }
    bcrypt.compare(password, hash.hashPassword, async function(err, result) {
        haveAccess(result);
      });
      async function haveAccess(result){
        if (result) {
            // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
            const user = await userDao.retrieveUserWithHashPassword(hash.hashPassword);
            const authToken = uuid();
            user.authToken = authToken;
            await userDao.updateUser(user);
            res.cookie("authToken", authToken);
            res.locals.user = user;
            res.redirect("/home");
        }else {
            // Auth fail
            res.locals.user = null;
            res.redirect("/?message=Authentication failed!Username or password is incorrect!");
        }
    }
});

router.get("/logout",verifyAuthenticated, function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("/");
});


module.exports = router;