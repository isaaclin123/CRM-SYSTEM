const userDao = require("../database/userDao.js");

/**
 * 
 * A global middleware to add user to locals after logging in 
 */
async function addUserToLocals(req, res, next) {
    let user = await userDao.retrieveUserWithAuthTokenPostgre(req.cookies.authToken);
        user=user.rows[0];
        res.locals.user = user;
        if(user){
            if(user.issuperadmin!=='1'){
                res.locals.admin=0;
                // console.log(res.locals.admin);
            }else if(user.issuperadmin==='1'){
               res.locals.admin=1; 
            }
        }
        
        next();
}

/**
 * A local middleware to verify user's login status and redirect user to different page base on user's login status
 */
function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }else {
        res.redirect("/");
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated
};