import pool from "../DBConnection.js";
import express from 'express';
import path from 'path';  
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Middleware to parse request bodies (for handling form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory and view engine
app.set('views', path.join(__dirname, '../views')); 
app.set('view engine', 'ejs');

// FINDING A SPECIFIC PARCEL
async function findParcel(parcel_id) {                    
    try {
        const [rows] = await pool.query("SELECT * FROM parcels WHERE parcel_id = ?", [parcel_id]);
        return rows[0];  // return the found parcel
    } catch (error) {
        console.error(error);
    }
}

// REGISTER NEW PARCEL 
async function insertParcel(parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive) {
    try {
        const [result] = await pool.query(
            "INSERT INTO parcels (parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive]
        );
        return result;
    } catch (error) {
        console.error('Error inserting parcel:', error);
    }
}

// FOR UPDATING A PARCEL
async function updateParcel(parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id) {
    try {
        const [result] = await pool.query(
            "UPDATE parcels SET parcel_category_id = ?, parcel_description = ?, parcel_unit_price = ?, parcel_weight = ?, parcel_length = ?, parcel_width = ?, parcel_height = ?, is_fragile = ?, is_perishable = ?, is_hazardous = ?, is_returnable = ?, is_temperature_sensitive = ? WHERE parcel_id = ?", 
            [parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id]
        );
        return result;
    } catch (error) {
        console.error('Error updating parcel:', error);
    }
}

// DELETING A PARCEL
async function deleteParcel(parcel_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM parcels WHERE parcel_id = ?", 
            [parcel_id]
        );
        return result;
    } catch (error) {
        console.error('Error deleting parcel:', error);
    }
}

// LISTING ALL PARCELS
async function listAllParcel() {
    try {
        const [rows] = await pool.query("SELECT * FROM parcels");
        return rows;  // return all parcels
    } catch (error) {
        console.error('Error listing parcel:', error);
    }
}

// ROUTES

// Home page listing all parcels
app.get('/', async (req, res) => {
    try {
        const parcels = await listAllParcel();
        res.render('index', { parcels });
    } catch (error) {
        res.status(500).send('Error fetching parcels.');
    }
});

// Add parcel form
app.get('/add-parcel', (req, res) => {
    res.render('add-parcel');
});

app.post('/add-parcel', async (req, res) => {
    const { parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive } = req.body;
    try {
        await insertParcel(parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding parcel.');
    }
});

// Update parcel form
app.get('/update-parcel/:id', async (req, res) => {
    const parcel_id = req.params.id;
    try {
        const parcel = await findParcel(parcel_id);
        if (parcel) {
            res.render('update-parcel', { parcel });
        } else {
            res.status(404).send('Parcel not found.');
        }
    } catch (error) {
        res.status(500).send('Error fetching parcel.');
    }
});

app.post('/update-parcel/:id', async (req, res) => {
    const { parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive } = req.body;
    const parcel_id = req.params.id;
    try {
        await updateParcel(parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating parcel.');
    }
});

// Delete parcel
app.get('/delete-parcel/:id', async (req, res) => {
    const parcel_id = req.params.id;
    try {
        await deleteParcel(parcel_id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting parcel.');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
