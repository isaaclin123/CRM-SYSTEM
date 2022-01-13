const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../database/userDao.js");

router.get("/manageUsers",verifyAuthenticated,async function(req, res){
    let users =await userDao.retrieveAllUsersByCompany(res.locals.user.isQualifiedCompany);
    res.locals.message=req.query.message;
    res.locals.users=users;
    res.render("manageUsers",{
        title:"Manage users",
        jsFile:"MangeUsersPage",
        cssFile:"ManageUserPage"

    })
})

router.post("/updateAdmin",verifyAuthenticated,async function(req,res){
    const user=req.body;
    try {
        await userDao.updateUser(user);
        /**
         * The problem might not lie with the backend, but with the frontend. If you are using AJAX to send the POST request, it is specifically designed to not change your url.
         */
    } catch (error) {
        console.log(error.message)
        res.redirect("/manageUsers?message=Error! can not update");
    }

})

module.exports=router;

