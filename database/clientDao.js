
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
function getCurrentTime(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // let dateTime = date+' '+time;
    return date;
};

/**
 * Inserts the given client into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the client.
 * 
 * @param client the client to insert
 */
 async function createClient(client) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into Clients (first_name, last_name, email,phone_number,city,country,profession,website,social_media,notes_on_client,meet_with,tag,belong_company,progress_status) values(${client.first_name},${client.last_name},${client.email},${client.phone_number},${client.city},${client.country},${client.profession},${client.website},${client.social_media},${client.notes_on_client},${client.meet_with},${client.tag},${client.belong_company},${client.progress_status})`);

    // Get the auto-generated ID value, and assign it back to the client object.
    client.id = result.lastID;
}

/**
 * Inserts the given clientTask into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the client task.
 * 
 * @param clientTask the clientTask to insert
 */
 async function createClientTask(clientTask) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into TaskForClient (task_name, task_description,clientID, task_start_date,task_end_date,userID,isCompleted) values(${clientTask.task_name},${clientTask.task_description},${clientTask.clientID},${clientTask.task_start_date},${clientTask.task_end_date},${clientTask.userID},${clientTask.isCompleted})`);

    // Get the auto-generated ID value, and assign it back to the client object.
    
    clientTask.id = result.lastID;
}

/**
 * Gets an array of all Clients from the database.
 */
 async function retrieveAllClients(company) {
    const db = await dbPromise;

    const Clients = await db.all(SQL`select * from Clients where belong_company=${company}`);

    return Clients;
}
async function retrieveAllClientsNumbers(company) {
    const db = await dbPromise;

    const Clients = await db.get(SQL`select count(*) from Clients where belong_company=${company}`);

    return Clients;
}

async function retrieveAllTasks() {
    const db = await dbPromise;

    const tasks = await db.all(SQL`select * from TaskForClient`);

    return tasks;
}
async function retrieveAllTasksNumberIfCompletedByUserID(isCompleted,userID) {
    const db = await dbPromise;

    const tasksNumber = await db.get(SQL`select count(*) from TaskForClient where isCompleted=${isCompleted} and userID=${userID}`);

    return tasksNumber;
}
async function retrieveFirstDueTasksByEndDate(userID) {
    const db = await dbPromise;

    // const task = await db.get(SQL`select * from TaskForClient where userID=${userID} group by id having task_end_date>=Date('now','localtime') order by task_end_date asc limit 1`);
    // // console.log(task,"here");
    
    const sameDueDateTasks=await db.all(SQL`select * from TaskForClient where task_end_date>=Date('now','localtime') and isCompleted="false" and userID=${userID}`);
    // console.log(sameDueDateTasks,"here");
    return sameDueDateTasks;
    
}
async function retrieveRecentClients(company) {
    const db = await dbPromise;

    const clients = await db.all(SQL`select * from Clients where belong_company=${company} group by id order by id desc limit 4 `);
    
    return clients;
    
}
/**
 * Deletes the client with the given id from the database.
 * 
 * @param {number} id the client's id
 */
 async function deleteClient(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from Clients
        where id = ${id}`);
}
/**
 * Updates the given client in the database
 * 
 * @param user the user to update
 */
 async function updateClient(client) {
    const db = await dbPromise;

    await db.run(SQL`
        update Clients
        set first_name = ${client.first_name}, last_name=${client.last_name},email = ${client.email},phone_number = ${client.phone_number}, city = ${client.city},country=${client.country},profession=${client.profession},website=${client.website},social_media = ${client.other_social_media},notes_on_client =${client.notes_on_client},meet_with = ${client.meet_with},tag = ${client.tag},progress_status=${client.progress_status}
        where id = ${client.id}`);
}
/**
 * Gets the tasks with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} id the id of the user to get.
 */
 async function retrieveClientTasksByClientID(id) {
    const db = await dbPromise;

    const tasks = await db.all(SQL`
        select * from TaskForClient
        where clientID = ${id}`);

    return tasks;
} 

async function retrieveTasksByUserID(id) {
    const db = await dbPromise;

    const tasks = await db.all(SQL`
        select * from TaskForClient
        where userID = ${id}`);

    return tasks;
}
/**
 * Deletes the task with the given id from the database.
 * 
 * @param {number} id the user's id
 */
 async function deleteTask(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from TaskForClient
        where id = ${id}`);

}
/**
 * Deletes the task with the given ClientID from the database.
 * 
 * @param {number} id the user's id
 */
 async function deleteAllClientTasks(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from TaskForClient
        where clientID = ${id}`);
}
/**
 * Updates the given clientTask in the database
 * 
 * @param user the user to update
 */
 async function updateClientTask(clientTask) {
    const db = await dbPromise;

    await db.run(SQL`
        update TaskForClient
        set task_name = ${clientTask.task_name}, task_description=${clientTask.task_description},task_start_date = ${clientTask.task_start_date},task_end_date = ${clientTask.task_end_date},userID=${clientTask.userID},clientID=${clientTask.clientID},isCompleted=${clientTask.isCompleted}
        where id = ${clientTask.taskID}`);
}
async function updateIsCompletedTask(taskID, isCompleted) {
    const db = await dbPromise;

    await db.run(SQL`
        update TaskForClient
        set isCompleted=${isCompleted}
        where id = ${taskID}`);
}
async function updateDeletedUserID(userID,taskID) {
    const db = await dbPromise;

    await db.run(SQL`
        update TaskForClient
        set userID=${userID}
        where id = ${taskID}`);
}

async function retrieveClientNameByID(clientID) {
    const db = await dbPromise;

    const clientName=await db.get(SQL`
        select first_name, last_name from Clients
        where id = ${clientID}`);
    
        return clientName;

}

module.exports = {
    createClient,
    retrieveAllClients,
    deleteClient,
    updateClient,
    createClientTask,
    retrieveClientTasksByClientID,
    deleteTask,
    deleteAllClientTasks,
    updateClientTask,
    retrieveTasksByUserID,
    updateIsCompletedTask,
    updateDeletedUserID,
    retrieveAllTasks,
    retrieveClientNameByID,
    retrieveAllClientsNumbers,
    retrieveAllTasksNumberIfCompletedByUserID,
    retrieveFirstDueTasksByEndDate,
    retrieveRecentClients
};