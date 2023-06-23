import pkg from 'pg';
const { Client } = pkg;

// Execute with command node databasepg.js

const client = new Client({
    // host: import.meta.env.VITE_PGHOST,
    // user: import.meta.env.VITE_PGUSER,
    // port: import.meta.env.VITE_PGPORT,
    // password: import.meta.env.VITE_PGPASSWORD,
    // database: import.meta.env.VITE_PGDATABASE,
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Geco!632000",
    database: "e-sign",
})


client.connect();

client.query("INSERT INTO users (username, password) Values ('joe2', crypt('user123', gen_salt('bf')))", (err,res) => {
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end();
})