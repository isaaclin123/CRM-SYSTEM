/**
 * Different functions to retrieve user data from database
 */
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
 async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from Users
        where authToken = ${authToken}`);

    return user;
}
/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 * 
 * @param user the user to insert
 */
 async function createUser(user) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into Users (first_name, last_name, username,hashPassword,saltRounds,isSuperAdmin,isQualifiedCompany,jobTitle,email) values(${user.first_name},${user.last_name},${user.username},${user.hashPassword},${user.saltRounds},${user.isSuperAdmin},${user.isQualifiedCompany},${user.jobTitle},${user.email})`);

    // Get the auto-generated ID value, and assign it back to the user object.
    user.id = result.lastID;
    console.log(user.id);
}
/**
 * Gets the user's hash password with the given username from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 */
 async function retrieveHashByUsername(username) {
    const db = await dbPromise;

    const hashPassword = await db.get(SQL`
        select hashPassword from Users
        where username = ${username}`);

    return hashPassword;
}
/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
 async function updateUser(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update Users
        set username = ${user.username}, first_name=${user.first_name},last_name = ${user.last_name},isSuperAdmin = ${user.isSuperAdmin}, isQualifiedCompany = ${user.isQualifiedCompany},jobTitle=${user.jobTitle},hashPassword=${user.hashPassword},saltRounds=${user.saltRounds},authToken = ${user.authToken},email= ${user.email}
        where id = ${user.id}`);
}
/**
 * Get a user's id by the given username
 * 
 * @param {string}username the user's username
 */
async function getIDByUsername(username){
    const db = await dbPromise;
    const id =await db.get(SQL`select id from Users where username=${username}`);

    return id;
}
/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} id the id of the user to get.
 */
 async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from Users
        where id = ${id}`);

    return user;
}

/**
 * Gets an array of all users from the database.
 */
 async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`select * from Users`);

    return users;
}
/**
 * Gets an array of all usernames from the database.
 */
async function retrieveAllUsernames() {
    const db = await dbPromise;

    const usernames = await db.all(SQL`select username from Users`);

    return usernames;
}
/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} hashPassword the hashPassword  of the user.
 */
async function retrieveUserWithHashPassword(hashPassword) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from Users where hashPassword = ${hashPassword}`);

    return user;
}

/**
 * Deletes the user with the given id from the database.
 * 
 * @param {number} id the user's id
 */
 async function deleteUser(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from Users
        where id = ${id}`);
}

// Export functions.
module.exports = {
    retrieveUserWithAuthToken,
    createUser,
    retrieveHashByUsername,
    updateUser,
    getIDByUsername,
    retrieveUserById,
    retrieveAllUsers,
    deleteUser,
    retrieveAllUsernames,
    retrieveUserWithHashPassword
    
};
