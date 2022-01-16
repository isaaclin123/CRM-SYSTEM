const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../database/userDao.js");
const clientDao=require("../database/clientDao.js")
const sanitizeHtml = require('sanitize-html');


router.get("/home",verifyAuthenticated,async function(req,res){
    try {
        const allClientNumber=await clientDao.retrieveAllClientsNumbers(res.locals.user.isQualifiedCompany);
        res.locals.clientNumbers=allClientNumber['count(*)'];
        const uncompletedTask=await clientDao.retrieveAllTasksNumberIfCompletedByUserID("false",res.locals.user.id);
        res.locals.uncompletedTask=uncompletedTask['count(*)'];
        const dueTasks=await clientDao.retrieveFirstDueTasksByEndDate(res.locals.user.id);
        for(let i=0;i<dueTasks.length;i++){
            let clientName=await clientDao.retrieveClientNameByID(dueTasks[i].clientID);
            if(clientName){
                dueTasks[i].clientName=clientName.first_name+" "+clientName.last_name;
            }else{
                dueTasks[i].clientName="none";
            }
            
        }
        const recentAddedClients=await clientDao.retrieveRecentClients(res.locals.user.isQualifiedCompany);
        console.log(recentAddedClients);
        res.locals.recentClients=recentAddedClients;
        // console.log(dueTasks);
        res.locals.dueTasks=dueTasks;
        res.locals.dueTasksNumber=dueTasks.length;
    } catch (error) {
        console.log(error);
        res.redirect("/home");
    }
    res.render("home",{
        title:"home",
        jsFile:"homePage",
        cssFile:"homePage2",
        isHomePage:"true"
    })
})

module.exports = router
