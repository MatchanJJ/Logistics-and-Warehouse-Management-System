import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

//DB Connection
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();
//Query testing
async function runQuery() {
    try {
        const [rows, fields] = await pool.query("SELECT * FROM package");
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}

runQuery();
