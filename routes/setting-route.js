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

router.get("/user",verifyAuthenticated,async function(req,res){
    if(req.query.id){

        let user =await userDao.retrieveUserById(req.query.id);
        res.json(user)
   
    }else{

        res.json(res.locals.user);
    }
  
})

router.get("/users",verifyAuthenticated,async function(req,res){
    let allUsers= await userDao.retrieveAllUsersByCompany(res.locals.user.isQualifiedCompany);
    res.json(allUsers);
})

router.get("/checkUser",verifyAuthenticated,function(req,res){
    const username = sanitizeHtml(req.query.username);
    const currentUserName=res.locals.user.username;
    console.log(username);
    getUsernames();
    async function getUsernames(){
        const usernamesOBJ= await userDao.retrieveAllUsernames();
        console.log(usernamesOBJ);
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
router.post("/checkOldPassword",verifyAuthenticated,async function(req,res){
    const oldPassword=sanitizeHtml(req.body.oldPassword);
    const username=res.locals.user.username;
    let hash =await userDao.retrieveHashByUsername(username);
    if(hash==undefined){
        hash={hashPassword:0};
    }
    bcrypt.compare(oldPassword, hash.hashPassword, async function(err, result) {
        if(result){
            res.send("true");
        }else{
            res.send("false");
        }
      });
})

router.post("/updateUser",verifyAuthenticated,async function(req,res){
    const user =res.locals.user;
    console.log(req.body);
    user.username=sanitizeHtml(req.body.username);
    user.first_name=sanitizeHtml(req.body.first_name);
    user.last_name=sanitizeHtml(req.body.last_name);
    user.jobTitle=sanitizeHtml(req.body.jobTitle);
    user.email=sanitizeHtml(req.body.email);
    try {
        await userDao.updateUser(user);
        res.redirect("/setting?message=Update successfully");
    } catch (error) {
        console.log(error.message)
        res.redirect("/setting?message=Error! can not update");
    }
})


router.post("/updateUserPassword",verifyAuthenticated,function(req,res){
    const password =sanitizeHtml(req.body.password2);
    let user=res.locals.user;
    try {
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            user.hashPassword=hash;
            await userDao.updateUser(user);
        });
        res.redirect("/setting?message=Update successfully");
    } catch (error) {
        console.log(error.message);
        res.redirect("/setting?message=Error! can not update");
    }
})

router.get("/deleteUser",verifyAuthenticated,async function(req,res){
    let userID;
    if(req.query.userID){
        userID=req.query.userID;
        try {
            await userDao.deleteUser(userID);
            let userTasks=await clientDao.retrieveTasksByUserID(userID);
            for(let i=0;i<userTasks.length;i++){
                await clientDao.updateDeletedUserID(-1,userTasks[i].id);
            }
            res.redirect("/manageUsers?message=User deleted!");
        } catch (error) {
            console.log(error.message);
            res.redirect("/manageUsers?message=Error! can not delete");
        }
    }else{
        userID=res.locals.user.id;
        try {
            await userDao.deleteUser(userID);
            let userTasks=await clientDao.retrieveTasksByUserID(userID);
            for(let i=0;i<userTasks.length;i++){
                await clientDao.updateDeletedUserID(-1,userTasks[i].id);
            }
            res.redirect("/");
        } catch (error) {
            console.log(error.message);
            res.redirect("/setting?message=Error! can not delete");
        }
    }
    
})

module.exports = router;