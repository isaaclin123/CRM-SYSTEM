const express = require("express");
const router = express.Router();
const { verifyAuthenticated, addUserToLocals } = require("../middleware/middleware.js");
const clientDao = require("../database/clientDao.js");
const sanitizeHtml = require('sanitize-html');

router.get("/contact",verifyAuthenticated,async function(req, res){
    let Clients=await clientDao.retrieveAllClients();
    res.locals.Clients=Clients;
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
        facebook:sanitizeHtml(req.body.facebook),
        instagram:sanitizeHtml(req.body.instagram),
        other_social_media:sanitizeHtml(req.body.other_social_media),
        meet_with:sanitizeHtml(req.body.meet_with),
        notes_on_client:sanitizeHtml(req.body.notes_on_client),
        addedBy:user.first_name+" "+user.last_name
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
        console.log("delete");
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




module.exports = router;