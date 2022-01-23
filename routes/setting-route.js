const express = require("express");
const router = express.Router();
const { verifyAuthenticated} = require("../middleware/middleware.js");
const bcrypt = require ('bcrypt');
const userDao = require("../database/userDao.js");
const clientDao = require("../database/clientDao.js");
const saltRounds =10;
//Setup sanitizer
const sanitizeHtml = require('sanitize-html');

router.get("/setting",verifyAuthenticated,function(req, res){
    res.locals.message=req.query.message;
    res.render("setting",{
        title:"Setting",
        jsFile:"settingPage",
        cssFile:"settingPage"
    })
})

/**
 * Send user details to the front end
 */
router.get("/user",verifyAuthenticated,async function(req,res){
    if(req.query.id){
        let user =await userDao.retrieveUserByIdPostgre(req.query.id);
        res.json(user.rows[0])
    }else{
        res.json(res.locals.user);
    }
  
})

/**
 * Send all users to front end
 */
router.get("/users",verifyAuthenticated,async function(req,res){
    let allUsers= await userDao.retrieveAllUsersByCompanyPostgre(res.locals.user.isqualifiedcompany);
    res.json(allUsers.rows);
})

/**
 * Check username availability excluding current user's username
 */
router.get("/checkUser",verifyAuthenticated,function(req,res){
    const username = sanitizeHtml(req.query.username);
    const currentUserName=res.locals.user.username;
    getUsernames();
    async function getUsernames(){
        let usernamesOBJ= await userDao.retrieveAllUsernamesPostgre();
        usernamesOBJ=usernamesOBJ.rows;
        let flag=false;
        if(usernamesOBJ.length>0){
            for (let i=0;i<usernamesOBJ.length;i++){
                if(usernamesOBJ[i].username===username&&usernamesOBJ[i].username!=currentUserName){
                    flag=true; 
                    break;
                }
            }
            if(flag===true){
                res.send("true");
            }else{
                res.send("false");
            }
        }else{
            res.send("false");
        }
    }
})

/**
 * Check user's current password
 */
router.post("/checkOldPassword",verifyAuthenticated,async function(req,res){
    const oldPassword=sanitizeHtml(req.body.oldPassword);
    const username=res.locals.user.username;
    let hash =await userDao.retrieveHashByUsernamePostgre(username);
    if(hash.rows.length===0){
        hash=0;
    }else{
        hash=hash.rows[0]["hashpassword"];
    }
    bcrypt.compare(oldPassword, hash, async function(err, result) {
        if(result){
            res.send("true");
        }else{
            res.send("false");
        }
      });
})

/**
 * Update user's profile
 */
router.post("/updateUser",verifyAuthenticated,async function(req,res){
    const user =res.locals.user;
    user.username=sanitizeHtml(req.body.username);
    user.first_name=sanitizeHtml(req.body.first_name);
    user.last_name=sanitizeHtml(req.body.last_name);
    user.jobtitle=sanitizeHtml(req.body.jobTitle);
    user.email=sanitizeHtml(req.body.email);
    try {
        await userDao.updateUserPostgre(user);
        res.redirect("/setting?message=Update successfully");
    } catch (error) {
        console.log(error.message)
        res.redirect("/setting?message=Error! can not update");
    }
})

/**
 * Update user's passowrd
 */
router.post("/updateUserPassword",verifyAuthenticated,function(req,res){
    const password =sanitizeHtml(req.body.password2);
    let user=res.locals.user;
    try {
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            user.hashpassword=hash;
            await userDao.updateUserPostgre(user);
        });
        res.redirect("/setting?message=Update password successfully");
    } catch (error) {
        console.log(error.message);
        res.redirect("/setting?message=Error! can not update password");
    }
})

/**
 * Delete user
 */
router.get("/deleteUser",verifyAuthenticated,async function(req,res){
    let userID;
    if(req.query.userID){
        userID=req.query.userID;
        try {
            let userTasks=await clientDao.retrieveTasksByUserIDPostgre(userID);
            userTasks=userTasks.rows;
            for(let i=0;i<userTasks.length;i++){
                await clientDao.updateDeletedUserIDPostgre(-1,userTasks[i].id);
            }
            await userDao.deleteUserPostgre(userID);
            res.redirect("/manageUsers?message=User deleted!");
        } catch (error) {
            console.log(error.message);
            res.redirect("/manageUsers?message=Error! can not delete");
        }
    }else{
        userID=res.locals.user.id;
        try {
            let userTasks=await clientDao.retrieveTasksByUserIDPostgre(userID);
            userTasks=userTasks.rows;
            for(let i=0;i<userTasks.length;i++){
                await clientDao.updateDeletedUserIDPostgre(-1,userTasks[i].id);
            }
            await userDao.deleteUserPostgre(userID);
            res.redirect("/");
        } catch (error) {
            console.log(error.message);
            res.redirect("/setting?message=Error! can not delete");
        }
    }
    
})
router.post("/AddQualifiedCompany",verifyAuthenticated,async function(req,res){
    let company=req.body.newCompany;
    company=company.trim().toLowerCase().replace(/\s/g, "");
    try {
        await clientDao.addCompanyPostgre(company);
        res.redirect(`/setting?message=Company ${req.body.newCompany} created successfully`);
    } catch (error) {
        console.log(error.message);
        res.redirect("/setting?message=Error! Company already exist!")
    }
})

module.exports = router;