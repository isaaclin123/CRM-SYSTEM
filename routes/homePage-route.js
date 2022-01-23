const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const userDao = require("../database/userDao.js");
const clientDao=require("../database/clientDao.js")
const sanitizeHtml = require('sanitize-html');

/**
 * Render the home page with the client numbers, recent client details, uncompleted tasks numbers and due tasks
 * 
 * 
 */

function returnDateFormat(dateNumberString){
    return dateNumberString.substring(0,4)+"-"+dateNumberString.substring(4,6)+"-"+dateNumberString.substring(6,8);
}
router.get("/home",verifyAuthenticated,async function(req,res){
    try {
        const allClientNumber=await clientDao.retrieveAllClientsNumbersPostgre(res.locals.user.isqualifiedcompany);
        res.locals.clientNumbers=allClientNumber.rows[0]['count'];
        const uncompletedTask=await clientDao.retrieveAllTasksNumberIfCompletedByUserIDPostgre("false",res.locals.user.id);
        res.locals.uncompletedTask=uncompletedTask.rows[0]['count'];
        let dueTasks=await clientDao.retrieveFirstDueTasksByEndDatePostgre(res.locals.user.id);
        dueTasks=dueTasks.rows;
        for(let i=0;i<dueTasks.length;i++){
            let clientName=(await clientDao.retrieveClientNameByIDPostgre(dueTasks[i].clientid)).rows[0];
            if(clientName){
                dueTasks[i].clientName=clientName['first_name']+" "+clientName['last_name'];
            }else{
                dueTasks[i].clientName="none";
            }
            dueTasks[i].task_start_date=returnDateFormat(dueTasks[i].task_start_date);
            dueTasks[i].task_end_date=returnDateFormat(dueTasks[i].task_end_date);    
        }
        const recentAddedClients=await clientDao.retrieveRecentClientsPostgre(res.locals.user.isqualifiedcompany);
        res.locals.recentClients=recentAddedClients.rows;
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
