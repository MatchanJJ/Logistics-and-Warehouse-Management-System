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


//FINDING A SPECIFIC PARCEL
async function findParcel(parcel_id) {                    
    try {
        const [rows, fields] = await pool.query("SELECT * FROM parcels WHERE parcel_id = ?",[parcel_id]);
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}

//REGISTER NEW PARCEL 
async function insertParcel(parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive) {
    try {
        const [result] = await pool.query(
            "INSERT INTO products (parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive]
        );
        console.log('Parcel inserted with ID:', result.insertId);
    } catch (error) {
        console.error('Error inserting parcel:', error);
    }
}

// FOR UPDATING A PARCEL
async function updateParcel(parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id) {
    try {
        const [result] = await pool.query(
            "UPDATE products SET parcel_category_id = , parcel_description = ?, parcel_unit_price = ?, parcel_weight = ?, parcel_length = ?, parcel_width = ?, parcel_height = ?, is_fragile = ?, is_perishable = ?, is_hazardous = ?, is_returnable = ?, is_temperature_sensitive = ? WHERE parcel_id = ?", 
            [parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id]
        );
        if (result.affectedRows > 0) {
            console.log('Parcel details updated.');
        } else {
            console.log('No parcel found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating parcel:', error);
    }
}

//DELETING A PARCEL
async function deleteParcel(parcel_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM parcels WHERE parcel_id = ?", 
            [product_id]
        );
        if (result.affectedRows > 0) {
            console.log('Parcel deleted.');
        } else {
            console.log('No parcel found with the given ID.');
        }
    } catch (error) {
        console.error('Error deleting parcel:', error);
    }
}

//LISTING ALL PARCEL LIKE LITERALLY ALL
async function listAllParcel() {
    try {
        const [rows] = await pool.query("SELECT * FROM parcels");
        console.log('All Parcels:', rows);
    } catch (error) {
        console.error('Error listing parcel:', error);
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});