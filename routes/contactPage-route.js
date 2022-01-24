const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const clientDao = require("../database/clientDao.js");
const sanitizeHtml = require('sanitize-html');
const upload=require('../middleware/multer-uploader');
const csvConverter=require('convert-csv-to-json');
function returnDateFormat(dateNumberString){
    return dateNumberString.substring(0,4)+"-"+dateNumberString.substring(4,6)+"-"+dateNumberString.substring(6,8);
}
function returnNumberFormat(dateString){
    return dateString.replaceAll("-","").padStart(8,"0");
}
/**
 * Render contact page
 */
router.get("/contact",verifyAuthenticated,async function(req, res){
    let Clients=await clientDao.retrieveAllClientsByCompanyPostgre(res.locals.user.isqualifiedcompany);
    let user=res.locals.user;
    Clients=Clients.rows;
    Clients=Clients.filter(function(client){
        return client.belong_company===user.isqualifiedcompany;
    })
    res.locals.realClients=Clients;
    res.locals.message=req.query.message;
    res.render("contact",{
        title:"Contact page",
        jsFile:"contactPage",
        cssFile:"contactPage"

    });
});

/**
 * create client
 */
router.post("/contact/save",verifyAuthenticated,async function(req,res){
    let user=res.locals.user;
    let client={
        first_name:sanitizeHtml(req.body.first_name),
        last_name:sanitizeHtml(req.body.last_name),
        email:sanitizeHtml(req.body.email),
        phone_number:sanitizeHtml(req.body.phone_number),
        city:sanitizeHtml(req.body.city),
        country:sanitizeHtml(req.body.country),
        profession:sanitizeHtml(req.body.profession),
        website:sanitizeHtml(req.body.website),
        social_media:sanitizeHtml(req.body.social_media),
        meet_with:sanitizeHtml(req.body.meet_with),
        notes_on_client:sanitizeHtml(req.body.notes_on_client),
        tag:sanitizeHtml(req.body.tag),
        belong_company:user.isqualifiedcompany,
        progress_status:"Establish contact"
    }
    try {
        await clientDao.createClientPostgre(client);
        res.redirect("/contact?message=Client added!")
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not add a client!")
    }
    
})
/**
 * Delete client
 */
router.post("/contact/delete",verifyAuthenticated,async function(req,res){
    if(req.body.clientID){
        const clientID=req.body.clientID;
            try {
                await clientDao.deleteAllClientTasksPostgre(clientID);
                await clientDao.deleteClientPostgre(clientID);
            } catch (error) {
                console.log(error.message);
                res.redirect("/contact?message=Error,can not delete a client!")
            }
    }else if(req.body.length>0){
        let clientIDs=req.body;
        try {
            for(let i=0;i<clientIDs.length;i++){
                await clientDao.deleteAllClientTasksPostgre(clientIDs[i]);
                await clientDao.deleteClientPostgre(clientIDs[i]);
            }
        } catch (error) {
            console.log(error.message);
            res.redirect("/contact?message=Error,can not delete clients!")
        }
    }
})
/**
 * Update client details
 */
router.post("/contact/edit",verifyAuthenticated,async function(req,res){
    let client=JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
    try {
        await clientDao.updateClientPostgre(client);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not edit client information!")
    }
})

/**Create client task */
router.post("/contact/createTask",verifyAuthenticated,async function(req,res){
    let clientTask;
    if(req.query.page){
        clientTask={
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
    }else{
        clientTask=JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
    }
    try {
        await clientDao.createClientTaskPostgre(clientTask);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not add task!")
    }  
})

/**
 * Send client tasks to front end
 */
router.post("/contact/getTasks",verifyAuthenticated,async function(req,res){
    let clientID=req.body.clientID;
    try {
        let tasks=await clientDao.retrieveClientTasksByClientIDPostgre(clientID);       
        res.send(tasks.rows);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not retrieve tasks!")
    }
})
/**
 * Delete task
 */
router.get("/contact/deleteTask",verifyAuthenticated,async function(req,res){
    let taskID=req.query.taskID;
    try {
        await clientDao.deleteTaskPostgre(taskID);
    } catch (error) {
        if(req.query.page){
            console.log(error.message);
            res.redirect("/taskManagement?message=Error,can not delete task!")
        }else{
            console.log(error.message);
            res.redirect("/contact?message=Error,can not delete task!")
        }
    }
})
router.post("/contact/deleteTask",verifyAuthenticated,async function(req,res){
    const taskIDs=req.body;
    try {
        for(let i=0;i<taskIDs.length;i++){
            await clientDao.deleteTaskPostgre(taskIDs[i]);
        }
    } catch (error) {
        console.log(error.message);
        res.redirect("/taskManagement?message=Error! Can not delete task")
    }  
});

/**
 * Update task's details
 */
router.post("/contact/updateTask",verifyAuthenticated,async function(req,res){
    let clientTask=JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
    try {
        await clientDao.updateClientTaskPostgre(clientTask);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not update task!")
    }
})
/**update task completion status */
router.get("/contact/updateTaskCompleted",verifyAuthenticated,async function(req,res){
    const taskID=req.query.taskID;
    const isCompleted=req.query.isCompleted;
    try {
        await clientDao.updateIsCompletedTaskPostgre(taskID,isCompleted);
    } catch (error) {
        if(req.query.page){
            console.log(error.message);
            res.redirect("/userTasks?message=Error,can not update task!")
        }else{
            console.log(error.message);
            res.redirect("/contact?message=Error,can not update task!");
        } 
    }

})

router.post("/uploadCSV",verifyAuthenticated,upload.single("CSVFile"),async function(req,res){
    const user=res.locals.user;
    const {filename:CSVFile}=req.file;
        if(CSVFile.lastIndexOf(".csv")===-1){
            res.redirect("/contact?message=Error,Please only upload CSV file!")
        }else{
            try {
                let CSVData=csvConverter.fieldDelimiter(',').getJsonFromCsv(`${req.file.path}`);
                for(let i=0;i<CSVData.length;i++){
                    let tableData=Object.values(CSVData[i]);
                    let client={
                        first_name:tableData[0].replace(/^"(.*)"$/, '$1'),
                        last_name:tableData[1].replace(/^"(.*)"$/, '$1'),
                        email:tableData[2].replace(/^"(.*)"$/, '$1'),
                        phone_number:tableData[3].replace(/^"(.*)"$/, '$1'),
                        city:tableData[4].replace(/^"(.*)"$/, '$1'),
                        country:tableData[5].replace(/^"(.*)"$/, '$1'),
                        profession:tableData[6].replace(/^"(.*)"$/, '$1'),
                        website:tableData[7].replace(/^"(.*)"$/, '$1'),
                        social_media:tableData[8].replace(/^"(.*)"$/, '$1'),
                        progress_status:tableData[9].replace(/^"(.*)"$/, '$1')||"Establish contact",
                        notes_on_client:tableData[10].replace(/^"(.*)"$/, '$1'),
                        meet_with:tableData[11].replace(/^"(.*)"$/, '$1'),
                        tag:tableData[12].replace(/^"(.*)"$/, '$1'),
                        belong_company:user.isqualifiedcompany
                    };
                    await clientDao.createClientPostgre(client);
                };
                res.redirect("/contact?message=file upload and client added successfully!")
            } catch (error) {
                console.log(error.message);
                res.redirect("/contact?message=Error,can not upload the file!")
            }

        }
 
});

module.exports = router;