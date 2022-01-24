const express = require("express");
const router = express.Router();
const { verifyAuthenticated, addUserToLocals } = require("../middleware/middleware.js");
const clientDao = require("../database/clientDao.js");
const userDao = require("../database/userDao.js");
const sanitizeHtml = require('sanitize-html');
function returnDateFormat(dateNumberString){
    return dateNumberString.substring(0,4)+"-"+dateNumberString.substring(4,6)+"-"+dateNumberString.substring(6,8);
}
function returnNumberFormat(dateString){
    return dateString.replaceAll("-","").padStart(8,"0");
}
/**
 * Render project timeline csv converter page
 */
router.get("/task",verifyAuthenticated,function(req,res){
    res.render("task",{
        title:"Task Page",
        jsFile:"taskPage",
        cssFile:"taskPage"
    })
})

/**
 * Render task management page
 */
router.get("/taskManagement",verifyAuthenticated,async function(req,res){
    res.locals.message=req.query.message;
    let tasks=(await clientDao.retrieveAllTasksPostgre()).rows;
    for(let i=0;i<tasks.length;i++){
        tasks[i].task_start_date=returnDateFormat(tasks[i].task_start_date);
        tasks[i].task_end_date=returnDateFormat(tasks[i].task_end_date);
        let userName=(await userDao.retrieveUserNameByIDPostgre(tasks[i].userid)).rows[0];
        if(userName){
            tasks[i].responsiblePerson=userName.first_name+" "+userName.last_name;
        }else{
            tasks[i].responsiblePerson="none";
        }
        let client=(await clientDao.retrieveClientNameByIDPostgre(tasks[i].clientid)).rows[0];
        if(client){
            tasks[i].clientName=client.first_name+" "+client.last_name;
        }else{
            tasks[i].clientName="none";
        }
    }
    res.locals.tasks=tasks;
    res.locals.clients=(await clientDao.retrieveAllClientsByCompanyPostgre(res.locals.user.isqualifiedcompany)).rows;
    res.locals.users=(await userDao.retrieveAllUsersByCompanyPostgre(res.locals.user.isqualifiedcompany)).rows;
    res.render("taskManagement",{
        title:"Task Management",
        jsFile:"taskManagementPage",
        cssFile:"taskManagementPage"
    }) 
})

/**
 * Render "Your tasks" page
 */
router.get("/userTasks",verifyAuthenticated,async function(req,res){
    res.locals.message=req.query.message;
    res.locals.tasks=(await clientDao.retrieveTasksByUserIDPostgre(res.locals.user.id)).rows;
    let tasks=res.locals.tasks;
    res.locals.taskNumber=tasks.length;
    let completedTaskNumber=0;
    let unCompletedTaskNumber=0;
    for(let i=0;i<tasks.length;i++){
        if(tasks[i].iscompleted==="true"){
            completedTaskNumber++;
            tasks[i].iscompleted=1;
        }else{
            unCompletedTaskNumber++;
            tasks[i].iscompleted=0;
        }
        tasks[i].task_start_date=returnDateFormat(tasks[i].task_start_date);
        tasks[i].task_end_date=returnDateFormat(tasks[i].task_end_date);
        let client=(await clientDao.retrieveClientNameByIDPostgre(tasks[i].clientid)).rows[0];
        if(client){
            tasks[i].clientName=client.first_name+" "+client.last_name;
        }else{
            tasks[i].clientName="none";
        }

    }
    res.locals.completedTaskNumber=completedTaskNumber;
    res.locals.unCompletedTaskNumber=unCompletedTaskNumber;
    res.locals.clients=(await clientDao.retrieveAllClientsByCompanyPostgre(res.locals.user.isqualifiedcompany)).rows;
    res.render("userTaskManagement",{
        title:"Your tasks",
        jsFile:"userTaskManagementPage",
        cssFile:"userTaskManagementPage"
    })
})

router.post("/newtask/createTask",verifyAuthenticated,async function(req,res){
    const task={
        task_name:sanitizeHtml(req.body.task_name),
        task_description:sanitizeHtml (req.body.task_description),
        task_start_date:sanitizeHtml (req.body.task_start_date),
        task_end_date:sanitizeHtml (req.body.task_end_date),
        userid:sanitizeHtml(req.body.userID)||res.locals.user.id,
        clientid:sanitizeHtml(req.body.clientID),
        iscompleted:"false"
    };
    task.task_start_date=returnNumberFormat(task.task_start_date);
    task.task_end_date=returnNumberFormat(task.task_end_date);
    
    if(req.body.userID){
        try {
            await clientDao.createClientTaskPostgre(task);
            res.redirect("/taskManagement?message=Task created successfully");
        } catch (error) {
            console.log(error.message);
            res.redirect("/taskManagement?message=Error! Can not create task");
        } 
    }else{
        try {
            await clientDao.createClientTaskPostgre(task);
            res.redirect("/userTasks?message=Task created successfully");
        } catch (error) {
            console.log(error.message);
            res.redirect("/userTasks?message=Error! Can not create task");
        }
        
    }
})

router.post("/task/updateTask",verifyAuthenticated,async function(req,res){
    const task={
        task_name:sanitizeHtml(req.body.task_name),
        task_description:sanitizeHtml(req.body.task_description),
        task_start_date:sanitizeHtml(req.body.task_start_date),
        task_end_date:sanitizeHtml (req.body.task_end_date),
        userid:sanitizeHtml(req.body.userID)||res.locals.user.id,
        clientid:sanitizeHtml(req.body.clientID),
        iscompleted:sanitizeHtml(req.body.isCompleted),
        taskid:sanitizeHtml(req.query.taskID)
    }
    task.task_start_date=returnNumberFormat(task.task_start_date);
    task.task_end_date=returnNumberFormat(task.task_end_date);
    try {
        await clientDao.updateClientTaskPostgre(task);
        if(req.body.userID){
            res.redirect("/taskManagement?message=Task updated successfully");
        }else{
            res.redirect("/userTasks?message=Task updated successfully");
        }  
    } catch (error) {
        console.log(error.message);
        if(req.body.userID){
            res.redirect("/taskManagement?message=Error! Can not update task");
        }else{
            res.redirect("/userTasks?message=Error! Can not update task");
        }
    }
})

router.get("/task/clientName",verifyAuthenticated,async function(req,res){
    const clientName=await clientDao.retrieveClientNameByIDPostgre(req.query.clientID);
    res.json(clientName.rows[0]);
})


module.exports=router;