require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

console.log('Connecting with:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
});

client.connect()
    .then(() => {
        console.log('✅ Connected successfully!');
        return client.query('SELECT current_user, current_database()');
    })
    .then((res) => {
        console.log('Current user:', res.rows[0].current_user);
        console.log('Current database:', res.rows[0].current_database);
        return client.end();
    })
    .catch((err) => {
        console.error('❌ Connection error:', err.message);
        process.exit(1);
    });
