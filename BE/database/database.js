const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
sqlite3.verbose();

let connection;

async function initializeDatabase() {
    connection = await open({
        filename: './database/database.sqlite',
        driver: sqlite3.Database
    })
    // connection.on("trace", sql => console.log(sql));
    // await connection.migrate();

    connection.on("trace", (sql) => console.log("Executing SQL:", sql));
    await connection.migrate({ force: 'last' });
    console.log("Database connected and migrations are done.");
}

function database() {
    return connection;
}

module.exports = { initializeDatabase, database };