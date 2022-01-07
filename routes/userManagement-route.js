const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../database/userDao.js");

router.get("/manageUsers",verifyAuthenticated,async function(req, res){
    let users =await userDao.retrieveAllUsers();
    res.locals.users=users;
    res.render("manageUsers",{
        title:"Manage users",
        jsFile:"MangeUsersPage",
        cssFile:"ManageUserPage"

    })
})

module.exports=router;

