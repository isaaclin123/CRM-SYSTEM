const express = require("express");
const router = express.Router();
const bcrypt = require ('bcrypt');
const userDao = require("../database/userDao.js");
const saltRounds =10;
//Setup sanitizer
const sanitizeHtml = require('sanitize-html');
const qualifiedCompany=["superchatpal","universityofauckland"];

/**
 * Create new account
 */
router.post("/app/newAccount", async function(req, res){
    let password=sanitizeHtml(req.body.password2);
    let company =sanitizeHtml(req.body.companyName);
    let isQualifiedCompany="false";
    company=company.trim().toLowerCase().replace(/\s/g, "");
    if(qualifiedCompany.includes(company)){
        isQualifiedCompany=company;
        let user={
            username:sanitizeHtml(req.body.username),
            first_name:sanitizeHtml(req.body.first_name),
            last_name:sanitizeHtml(req.body.last_name),
            isSuperAdmin:"false",
            isQualifiedCompany:sanitizeHtml(isQualifiedCompany),
            jobTitle:(req.body.jobTitle),
            saltRounds:saltRounds
        }
        console.log(user.first_name);
        try {
            bcrypt.hash(password, saltRounds, async function(err, hash) {
                user.hashPassword=hash;
                console.log(user);
                await userDao.createUser(user);
            });
            res.redirect(`/?message=Welcome ${user.username}! Account created successfully,please log in!`);
        } catch (error) {
            console.log(error.message);
            res.redirect(`/newAccount?errorMessage=Error! Cannot create an account, please try again.`)
        }
    }else{
        res.redirect(`/newAccount?errorMessage=Error! Cannot create an account, please try again.`)
    }
    

    
});     
/**Render new account page */
router.get("/newAccount",function(req, res){
    if(res.locals.user){
        res.redirect("/home")
    }else{
        res.locals.errorMessage=req.query.errorMessage;
        res.render("newAccount",{
            title:"New account",
            jsFile:"newAccountPage",
            cssFile:"newAccountPage"
        });
    }
    
});

// router.post("/newAccount", async function(req, res){

//     res.redirect("/login");
// });
/**
 * Check username availability
 */
router.get("/app/newAccount", function(req,res){
    const username = sanitizeHtml(req.query.username);
    console.log(username);
    getUsernames();
    async function getUsernames(){
        const usernamesOBJ= await userDao.retrieveAllUsernames();
        console.log(usernamesOBJ);
        if(usernamesOBJ.length>0){
            for (let i=0;i<usernamesOBJ.length;i++){
                if(usernamesOBJ[i].username===username){
                    res.send("true"); 
                }else{
                    res.send("false");
                }
            }
        }else{
            res.send("false");
        }

        

    }
});





module.exports = router;