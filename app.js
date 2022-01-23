/**
 * Main application file.
 * 
 *
 */

// Setup Express
const express = require("express");
const app = express();
const port = process.env.PORT||3000;
const sanitizeHtml = require('sanitize-html');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });



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



// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});