
const SQL = require("sql-template-strings");
const pool = require("./database.js");
function getCurrentTime(){
    let today = new Date();
    let month=today.getMonth()+1;
    if(month<10){
        month='0'+month;
    }
    let day=today.getDate();
    if(day<10){
        day='0'+day;
    }
    let date = Number(today.getFullYear()+''+month+''+day);
    // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // let dateTime = date+' '+time;
    
    return date;
};

async function createClientPostgre(client) {
    
    const text =(SQL`
        insert into Clients (first_name, last_name, email,phone_number,city,country,profession,website,social_media,notes_on_client,meet_with,tag,belong_company,progress_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning id`);
    const values=[client.first_name,client.last_name,client.email,client.phone_number,client.city,client.country,client.profession,client.website,client.social_media,client.notes_on_client,client.meet_with,client.tag,client.belong_company,client.progress_status];

    return pool.query(text,values);
    
}


async function createClientTaskPostgre(clientTask) {

    const text=(SQL`
        insert into TaskForClient (task_name, task_description,clientID, task_start_date,task_end_date,userID,isCompleted) values($1,$2,$3,$4,$5,$6,$7) returning id`);
    const values=[clientTask.task_name,clientTask.task_description,clientTask.clientid,clientTask.task_start_date,clientTask.task_end_date,clientTask.userid,clientTask.iscompleted]
    console.log(pool.query(text,values));
    return pool.query(text,values);
}

async function retrieveAllClientsByCompanyPostgre(company) {

    const text =(SQL`select * from Clients where belong_company=$1`);
    const values=[company];
    return pool.query(text,values);
}

async function retrieveAllClientsNumbersPostgre(company) {

    const text =(SQL`select count(*) from Clients where belong_company=$1`);
    const values=[company];

    return pool.query(text,values);
}

async function retrieveAllTasksPostgre() {

    const text=(SQL`select * from TaskForClient`);

    return pool.query(text);
}
async function retrieveAllTasksNumberIfCompletedByUserIDPostgre(isCompleted,userID) {

    const text=(SQL`select count(*) from TaskForClient where iscompleted=$1 and userid=$2`);
    const values=[isCompleted,userID];
    return pool.query(text,values);
}
async function retrieveFirstDueTasksByEndDatePostgre(userID) {
    
    const text=(SQL`select * from TaskForClient
     where task_end_date>=$1 and iscompleted=$2 and userid=$3`);
    const values=[getCurrentTime(),`false`,userID];
    return pool.query(text,values);   
}

async function retrieveRecentClientsPostgre(company) {

    const text=(SQL`select * from Clients where belong_company=$1 group by id order by id desc limit 4 `);
    const values=[company];
    
    return pool.query(text,values);
    
}

async function deleteClientPostgre(id) {

    const text=(SQL`
        delete from Clients
        where id = $1`);
    const values=[id];
    return pool.query(text,values);
}


async function updateClientPostgre(client) {

    const text=(SQL`
        update Clients
        set first_name = $1, last_name=$2,email = $3,phone_number = $4, city = $5,country=$6,profession=$7,website=$8,social_media = $9,notes_on_client =$10,meet_with = $11,tag = $12,progress_status=$13
        where id = $14`);
    const values=[client.first_name,client.last_name,client.email,client.phone_number,client.city,client.country,client.profession,client.website,client.social_media,client.notes_on_client,client.meet_with,client.tag,client.progress_status,client.id];

    return pool.query(text,values);
}

async function retrieveClientTasksByClientIDPostgre(id) {

    const text=(SQL`
        select * from TaskForClient
        where clientID = $1`);
    const values=[id]
    return pool.query(text,values);
} 

async function retrieveTasksByUserIDPostgre(id) {
    const text =(SQL`
        select * from TaskForClient
        where userID = $1`);
    const values=[id];

    return pool.query(text,values);
}
async function deleteTaskPostgre(id) {

    const text=(SQL`
        delete from TaskForClient
        where id = $1`);
    const values=[id];
    return pool.query(text,values);

}

async function deleteAllClientTasksPostgre(id) {

    const text=(SQL`
        delete from TaskForClient
        where clientID = $1`);
    const values=[id];
    return pool.query(text,values);
}

async function updateClientTaskPostgre(clientTask) {

    const text=(SQL`
        update TaskForClient
        set task_name = $1, task_description=$2,task_start_date = $3,task_end_date = $4,userID=$5,clientID=$6,isCompleted=$7
        where id = $8`);
    const values=[clientTask.task_name,clientTask.task_description,clientTask.task_start_date,clientTask.task_end_date,clientTask.userid,clientTask.clientid,clientTask.iscompleted,clientTask.taskid];
    return pool.query(text,values);
}

async function updateIsCompletedTaskPostgre(taskID, isCompleted) {

    const text=(SQL`
        update TaskForClient
        set isCompleted=$1
        where id = $2`);
    const values=[isCompleted,taskID];
    return pool.query(text,values);
}

async function updateDeletedUserIDPostgre(userID,taskID) {

    const text=(SQL`
        update TaskForClient
        set userid=$1
        where id = $2`);
    const values=[userID,taskID];
    return pool.query(text,values);
}

async function retrieveClientNameByIDPostgre(clientID) {

    const text=(SQL`
        select first_name, last_name from Clients
        where id = $1`);
    const values=[clientID];
    
        return pool.query(text,values);

}
async function addCompanyPostgre(company){
    const text=(SQL`insert into Company (company_name) values($1) returning id`);
    const values=[company];
    return pool.query(text,values);
}
module.exports = {
    retrieveAllClientsNumbersPostgre,
    retrieveAllTasksNumberIfCompletedByUserIDPostgre,
    retrieveFirstDueTasksByEndDatePostgre,
    retrieveClientNameByIDPostgre,
    retrieveRecentClientsPostgre,
    retrieveTasksByUserIDPostgre,
    updateDeletedUserIDPostgre,
    retrieveAllClientsByCompanyPostgre,
    createClientPostgre,
    updateClientPostgre,
    deleteAllClientTasksPostgre,
    deleteClientPostgre,
    createClientTaskPostgre,
    retrieveClientTasksByClientIDPostgre,
    updateIsCompletedTaskPostgre,
    deleteTaskPostgre,
    updateClientTaskPostgre,
    retrieveAllTasksPostgre,
    addCompanyPostgre
};