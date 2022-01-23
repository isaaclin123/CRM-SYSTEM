/**
 * Different functions to retrieve user data from database
 */
const SQL = require("sql-template-strings");
const pool=require("./database.js");

async function retrieveAllCompanyPostgre(){

    const text=(SQL`select company_name from Company`);
    return pool.query(text);
}

async function retrieveUserNameByIDPostgre(id){

    const text=(SQL`select first_name,last_name from Users where id=$1`);
    const values=[id];
    return pool.query(text,values);
}
async function retrieveUserWithAuthTokenPostgre(authToken) {

    const text=(SQL`
        select * from Users
        where authtoken = $1`);
    const values =[authToken];

    return pool.query(text,values);
}
async function createUserPostgre(user) {

    const text =(SQL`
        insert into Users (first_name, last_name, username,hashPassword,saltRounds,isSuperAdmin,isQualifiedCompany,jobTitle,email) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`);
    const values=[user.first_name,user.last_name,user.username,user.hashpassword,user.saltrounds,user.issuperadmin,user.isqualifiedcompany,user.jobtitle,user.email];
    return pool.query(text,values);
}

async function retrieveHashByUsernamePostgre(username) {

    const text=(SQL`
        select hashpassword from Users
        where username = $1`);
    const values=[username]

    return pool.query(text,values);
}

async function updateUserPostgre(user) {

    const text=(SQL`
        update Users
        set username = $1, first_name=$2,last_name = $3,issuperAdmin = $4, isqualifiedCompany = $5,jobtitle=$6,hashpassword=$7,saltrounds=$8,authToken = $9,email= $10
        where id = $11`);
    const values=[user.username,user.first_name,user.last_name,user.issuperadmin,user.isqualifiedcompany,user.jobtitle,user.hashpassword,user.saltrounds,user.authtoken,user.email,user.id];
    // console.log(values);
    return pool.query(text,values);
}

async function retrieveUserByIdPostgre(id) {

    const text=(SQL`
        select * from Users
        where id = $1`);
    const values=[id];

    return pool.query(text,values);
}
async function retrieveAllUsersByCompanyPostgre(company) {

    const text = (SQL`select * from Users where isqualifiedcompany=$1`);
    const values=[company];
    return pool.query(text,values);
}
async function retrieveAllUsersNameByCompanyPostgre(company) {

    const text = (SQL`select first_name,last_name from Users where isqualifiedcompany=$1`);
    const values=[company];
    return pool.query(text,values);
}

async function retrieveAllUsernamesPostgre() {

    const text=(SQL`select username from users`);

    return pool.query(text);
}
async function retrieveUserWithHashPasswordPostgre(hashpassword) {

    const text=(SQL`
        select * from Users where hashPassword = $1`);
    const values=[hashpassword];

    return pool.query(text,values);
}

async function deleteUserPostgre(id) {

    const text=(SQL`
        delete from Users
        where id = $1`);
    const values=[id];
    return pool.query(text,values);
}

module.exports = {
    createUserPostgre,
    retrieveAllUsernamesPostgre,
    retrieveHashByUsernamePostgre,
    retrieveUserWithHashPasswordPostgre,
    updateUserPostgre,
    retrieveUserWithAuthTokenPostgre,
    retrieveAllCompanyPostgre,
    retrieveAllUsersByCompanyPostgre,
    retrieveUserByIdPostgre,
    deleteUserPostgre,
    retrieveAllUsersNameByCompanyPostgre,
    retrieveUserNameByIDPostgre
    
};
