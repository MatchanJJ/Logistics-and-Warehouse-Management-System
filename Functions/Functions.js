import pool from "./DBConnection.js"
import express from 'express';
import path from 'path';  // Import the path module
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory (adjust the path as necessary)
app.set('views', path.join(__dirname, '../views')); 
app.set('view engine', 'ejs');

async function findPackage(id) {                    
    try {
        const [rows, fields] = await pool.query("SELECT * FROM package WHERE id = ?",[id]);
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}


//Query Entity function
async function queryForEntity(entity) {                    
    try {
        const [rows, fields] = await pool.query('SELECT * FROM ??', [entity]); // Query all rows and columns
        return rows;  // Return the rows (data) to be passed to the route
    } catch (error) {
        console.error(error);
        return [];  // Return an empty array if there's an error
    }
}

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    let entity = 'deliveries';  // Replace with your actual table name
    try {
        const test = await queryForEntity(entity);  // Await the query result
        console.log(test); // Log the result
        res.render('index.ejs', { test: test });  // Pass the data to the EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Error querying the database');
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
