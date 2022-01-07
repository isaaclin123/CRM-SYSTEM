const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/middleware.js");
const clientDao = require("../database/clientDao.js");
const sanitizeHtml = require('sanitize-html');
const upload=require('../middleware/multer-uploader');
const csvConverter=require('convert-csv-to-json');

router.get("/contact",verifyAuthenticated,async function(req, res){
    let Clients=await clientDao.retrieveAllClients();
    let user=res.locals.user;
    Clients=Clients.filter(function(client){
        return client.belong_company===user.isQualifiedCompany;
    })
    // console.log(Clients);
    res.locals.realClients=Clients;
    res.locals.message=req.query.message;
    res.render("contact",{
        title:"Contact page",
        jsFile:"contactPage",
        cssFile:"contactPage"

    });
});

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
        belong_company:user.isQualifiedCompany,
        progress_status:"Establish contact"
    }

    try {
        await clientDao.createClient(client);
        res.redirect("/contact?message=Client added!")
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not add a client!")
    }
    
})

router.post("/contact/delete",verifyAuthenticated,async function(req,res){
    if(req.body.clientID){
        let clientID=req.body.clientID;
            try {
                await clientDao.deleteAllClientTasks(clientID);
                await clientDao.deleteClient(clientID);
                // console.log("delete");
            } catch (error) {
                console.log(error.message);
                res.redirect("/contact?message=Error,can not delete a client!")
            }
    }else if(req.body){
        let clientIDs=req.body;
        console.log(clientIDs);
        for(let i=0;i<clientIDs.length;i++){
            try {
                await clientDao.deleteAllClientTasks(clientIDs[i]);
                await clientDao.deleteClient(clientIDs[i]);
                console.log("delete");
            } catch (error) {
                console.log(error.message);
                res.redirect("/contact?message=Error,can not delete clients!")
            }
        }
    }
    

})
router.post("/contact/edit",verifyAuthenticated,async function(req,res){
    let client=JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
    console.log(client);
    try {
        await clientDao.updateClient(client);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not edit client information!")
    }
})

router.post("/contact/createTask",verifyAuthenticated,async function(req,res){
    let clientTask=JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
    console.log(clientTask, "here");
    try {
        await clientDao.createClientTask(clientTask);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not add task!")
    }  
})

router.post("/contact/getTasks",verifyAuthenticated,async function(req,res){
    let clientID=req.body.clientID;
    try {
        let tasks=await clientDao.retrieveClientTasksByClientID(clientID);
        // console.log(tasks);        
        res.send(tasks);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not retrieve tasks!")
    }
})

router.get("/contact/deleteTask",verifyAuthenticated,async function(req,res){
    let taskID=req.query.taskID;
    try {

        await clientDao.deleteTask(taskID);
        // console.log("delete task");
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not delete task!")
    }
})

router.post("/contact/updateTask",verifyAuthenticated,async function(req,res){
    let clientTask=JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
    try {
        await clientDao.updateClientTask(clientTask);
        console.log(clientTask,"update");
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not update task!")
    }
})
router.get("/contact/updateTaskCompleted",verifyAuthenticated,async function(req,res){
    let taskID=req.query.taskID;
    let isCompleted=req.query.isCompleted;
    try {
        await clientDao.updateIsCompletedTask(taskID,isCompleted);
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not update task!")
    }

})

router.post("/uploadCSV",verifyAuthenticated,upload.single("CSVFile"),async function(req,res){
    const user=res.locals.user;
    const {filename:CSVFile}=req.file;
        if(CSVFile.lastIndexOf(".csv")===-1){
            res.redirect("/contact?message=Error,Please only upload CSV file!")
        }else{
            try {
        
                // console.log(CSVFile);
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
                        tag:tableData[12].replace(/^"(.*)"$/, '$1')||user.first_name+" "+user.last_name,
                        belong_company:user.isQualifiedCompany
                        
                    };
                    console.log(client);
                    await clientDao.createClient(client);
                };
                res.redirect("/contact?message=file upload and client added successfully!")
            } catch (error) {
                console.log(error.message);
                res.redirect("/contact?message=Error,can not upload the file!")
            }

        }
 
});






module.exports = router;