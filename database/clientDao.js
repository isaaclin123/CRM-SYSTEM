const cli = require("nodemon/lib/cli");
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

/**
 * Inserts the given client into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the client.
 * 
 * @param client the client to insert
 */
 async function createClient(client) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into Clients (first_name, last_name, email,phone_number,city,country,profession,website,facebook,instagram,other_social_media,notes_on_client,meet_with,addedBy) values(${client.first_name},${client.last_name},${client.email},${client.phone_number},${client.city},${client.country},${client.profession},${client.website},${client.facebook},${client.instagram},${client.other_social_media},${client.notes_on_client},${client.meet_with},${client.addedBy})`);

    // Get the auto-generated ID value, and assign it back to the client object.
    client.id = result.lastID;
}
/**
 * Gets an array of all Clients from the database.
 */
 async function retrieveAllClients() {
    const db = await dbPromise;

    const Clients = await db.all(SQL`select * from Clients`);

    return Clients;
}
/**
 * Deletes the client with the given id from the database.
 * 
 * @param {number} id the user's id
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
        set first_name = ${client.first_name}, last_name=${client.last_name},email = ${client.email},phone_number = ${client.phone_number}, city = ${client.city},country=${client.country},profession=${client.profession},website=${client.website},facebook = ${client.facebook},instagram = ${client.instagram},other_social_media = ${client.other_social_media},notes_on_client =${client.notes_on_client},meet_with = ${client.meet_with},addedBy = ${client.addedBy}
        where id = ${client.id}`);
}

module.exports = {
    createClient,
    retrieveAllClients,
    deleteClient,
    updateClient
};