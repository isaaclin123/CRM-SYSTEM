const express = require("express");
const router = express.Router();
const { verifyAuthenticated, addUserToLocals } = require("../middleware/middleware.js");
const clientDao = require("../database/clientDao.js");
const sanitizeHtml = require('sanitize-html');
const cli = require("nodemon/lib/cli");

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
        addedBy:user.first_name+" "+user.last_name,
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
    let clientID=req.body.clientID;
    try {
        await clientDao.deleteClient(clientID);
        await clientDao.deleteAllClientTasks(clientID);
        // console.log("delete");
    } catch (error) {
        console.log(error.message);
        res.redirect("/contact?message=Error,can not delete a client!")
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
    console.log(req.body, "here");
    let clientTask=JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
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




module.exports = router;