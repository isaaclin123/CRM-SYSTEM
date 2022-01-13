const express = require("express");
const router = express.Router();
const { verifyAuthenticated, addUserToLocals } = require("../middleware/middleware.js");
const clientDao = require("../database/clientDao.js");
const userDao = require("../database/userDao.js");
const sanitizeHtml = require('sanitize-html');

// router.get('/iframeUserTask',verifyAuthenticated,function(req, res){
//     res.render("iframeUserTask");
// } )

router.get("/task",verifyAuthenticated,function(req,res){
    res.render("task",{
        title:"Task Page",
        jsFile:"taskPage",
        cssFile:"taskPage"
    })
})

router.get("/taskManagement",verifyAuthenticated,async function(req,res){
    res.locals.message=req.query.message;
    res.locals.tasks=await clientDao.retrieveAllTasks();
    res.locals.clients=await clientDao.retrieveAllClients(res.locals.user.isQualifiedCompany);
    res.locals.users=await userDao.retrieveAllUsersByCompany(res.locals.user.isQualifiedCompany);
    res.render("taskManagement",{
        title:"Task Management",
        jsFile:"taskManagementPage",
        cssFile:"taskManagementPage"
    }) 
})

router.get("/userTasks",verifyAuthenticated,async function(req,res){
    res.locals.message=req.query.message;
    res.locals.tasks=await clientDao.retrieveTasksByUserID(res.locals.user.id);
    let tasks=res.locals.tasks;
    res.locals.taskNumber=tasks.length;
    let completedTaskNumber=0;
    let unCompletedTaskNumber=0;
    for(let i=0;i<tasks.length;i++){
        if(tasks[i].isCompleted==="true"){
            completedTaskNumber++;
            tasks[i].isCompleted=1;
        }else{
            unCompletedTaskNumber++;
            tasks[i].isCompleted=0;
        }
    }
    res.locals.completedTaskNumber=completedTaskNumber;
    res.locals.unCompletedTaskNumber=unCompletedTaskNumber;
    res.locals.clients=await clientDao.retrieveAllClients(res.locals.user.isQualifiedCompany);
    res.render("userTaskManagement",{
        title:"Your tasks",
        jsFile:"userTaskManagementPage",
        cssFile:"userTaskManagementPage"
    })
})

router.post("/task/createTask",verifyAuthenticated,async function(req,res){
    const task={
        task_name:sanitizeHtml(req.body.task_name),
        task_description:sanitizeHtml (req.body.task_description),
        task_start_date:sanitizeHtml (req.body.task_start_date),
        task_end_date:sanitizeHtml (req.body.task_end_date),
        userID:sanitizeHtml(req.body.userID)||res.locals.user.id,
        clientID:sanitizeHtml(req.body.clientID),
        isCompleted:"false"
    };
    try {
        if(req.body.userID){
            await clientDao.createClientTask(task);
            res.redirect("/taskManagement?message=Task created successfully");
        }else{
            await clientDao.createClientTask(task);
            res.redirect("/userTasks?message=Task created successfully");
        }
        
    } catch (error) {
        console.log(error.message);
        res.redirect("/taskManagement?message=Error! Can not create task")
    }
})

router.post("/task/updateTask",verifyAuthenticated,async function(req,res){
    const task={
        task_name:sanitizeHtml(req.body.task_name),
        task_description:sanitizeHtml(req.body.task_description),
        task_start_date:sanitizeHtml(req.body.task_start_date),
        task_end_date:sanitizeHtml (req.body.task_end_date),
        userID:sanitizeHtml(req.body.userID)||res.locals.user.id,
        clientID:sanitizeHtml(req.body.clientID),
        isCompleted:sanitizeHtml(req.body.isCompleted),
        taskID:sanitizeHtml(req.query.taskID)
    }
    console.log(task);
    try {
        await clientDao.updateClientTask(task);
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
    const clientName=await clientDao.retrieveClientNameByID(req.query.clientID);
    res.json(clientName);
})

router.post("/contact/deleteTask",verifyAuthenticated,async function(req,res){
    const taskIDs=req.body;
    console.log(taskIDs);
    try {
        for(let i=0;i<taskIDs.length;i++){
            await clientDao.deleteTask(taskIDs[i]);
        }
        console.log("delete");
    } catch (error) {
        console.log(error.message);
        res.redirect("/taskManagement?message=Error! Can not delete task")
    }
    
});
module.exports=router;