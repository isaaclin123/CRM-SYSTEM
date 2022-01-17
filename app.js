/**
 * Main application file.
 * 
 *
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;
const sanitizeHtml = require('sanitize-html');




// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set('views', './views');

// Setup body-parser
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));



// Use the middleware's addUserToLocals function
const { addUserToLocals}=require("./middleware/middleware.js");
app.use(addUserToLocals);

// Setup newAccount routes
const accountRouter = require("./routes/newAccount-routes.js");
app.use(accountRouter);

// Setup login and logout routes
const authRouter = require("./routes/login_logout_route.js");
app.use(authRouter);

app.use(require("./routes/contactPage-route.js"));


app.use(require("./routes/taskPage-route.js"));

app.use(require("./routes/homePage-route.js"));

app.use(require("./routes/setting-route.js"));

app.use(require("./routes/userManagement-route.js"));

process.on('uncaughtException',function(error){
    console.log(error.message);
    process.exit(1);
    
})

// let child =new (forever.Monitor)('app.js');

// child.on('exit',function(){
//     console.log("......exit by error");
// })

// child.start(true);



// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});