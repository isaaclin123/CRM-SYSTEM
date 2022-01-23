const express = require("express");
const router = express.Router();
const bcrypt = require ('bcrypt');
const userDao = require("../database/userDao.js");
const saltRounds =10;
//Setup sanitizer
const sanitizeHtml = require('sanitize-html');
// const qualifiedCompany=["superchatpal","universityofauckland"];

/**
 * Create new account when companyname is in the database
 */
router.post("/app/newAccount", async function(req, res){
    let password=sanitizeHtml(req.body.password2);
    let company =sanitizeHtml(req.body.companyName);
    let isQualifiedCompany="false";
    let qualifiedCompany=await userDao.retrieveAllCompanyPostgre();
    const allCompanies=[];
    for(let i=0;i<qualifiedCompany.rows.length;i++){
        allCompanies.push(qualifiedCompany.rows[i]["company_name"]);
    }
    company=company.trim().toLowerCase().replace(/\s/g, "");
    if(allCompanies.includes(company)){
        isQualifiedCompany=company;
        let user={
            username:sanitizeHtml(req.body.username),
            first_name:sanitizeHtml(req.body.first_name),
            last_name:sanitizeHtml(req.body.last_name),
            issuperadmin:"",
            isqualifiedcompany:sanitizeHtml(isQualifiedCompany),
            jobtitle:sanitizeHtml(req.body.jobTitle),
            email:sanitizeHtml(req.body.email),
            saltrounds:saltRounds
        }
        try {
            bcrypt.hash(password, saltRounds, async function(err, hash) {
                user.hashpassword=hash;
                const result=await userDao.createUserPostgre(user);
                if(result){
                    res.redirect(`/?message=Welcome ${user.username}! Account created successfully,please log in!`);
                }
            });  
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

/**
 * Check username availability
 */
 router.get("/app/newAccount", function(req,res){
    const username = sanitizeHtml(req.query.username);
    getUsernames();
    async function getUsernames(){
        let usernamesOBJ= await userDao.retrieveAllUsernamesPostgre();
        usernamesOBJ=usernamesOBJ.rows;
        let flag=false;
        if(usernamesOBJ.length>0){
            for (let i=0;i<usernamesOBJ.length;i++){
                if(usernamesOBJ[i].username===username){
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
});





module.exports = router;