const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexión exitosa a la base de datos.');
        await connection.end();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

testConnection();
