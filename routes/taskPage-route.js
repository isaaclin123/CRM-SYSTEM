const express = require("express");
const router = express.Router();
const { verifyAuthenticated, addUserToLocals } = require("../middleware/middleware.js");
const clientDao = require("../database/clientDao.js");
const sanitizeHtml = require('sanitize-html');

router.get("/task",verifyAuthenticated,function(req,res){
    res.render("task",{
        title:"Task Page",
        jsFile:"taskPage",
        cssFile:"taskPage"
    })
})

module.exports=router;