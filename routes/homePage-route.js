const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../database/userDao.js");
const sanitizeHtml = require('sanitize-html');


router.get("/home",verifyAuthenticated,function(req,res){
    res.render("home",{
        title:"home",
        jsFile:"homePage",
        cssFile:"homePage2",
        isHomePage:"true"
    })
})

module.exports = router
