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

//FINDING A SPECIFIC PACKAGE
async function findPackage(id) {                    
    try {
        const [rows, fields] = await pool.query("SELECT * FROM package WHERE id = ?",[id]);
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}

//REGISTER NEW PACKAGE
async function insertPackage(id, weight, dimensions, type, origin, destination, tracking_number, description) {
    try {
        const [result] = await pool.query(
            "INSERT INTO package (id, weight, dimensions, type, origin, destination, tracking_number, description) VALUES (?, ?, ?, ?, ?,?,?,?,?)",
            [id, weight, dimensions, type, origin, destination, tracking_number, description]
        );
        console.log('Package inserted with ID:', result.insertId);
    } catch (error) {
        console.error('Error inserting package:', error);
    }
}

// FOR UPDATING A PACKAGE
async function updatePackage(id, weight, dimensions, type, origin, destination, trackingNumber, description) {
    try {
        const [result] = await pool.query(
            "UPDATE package SET weight = ?, dimensions = ?, type = ?, origin = ?, destination = ?, tracking_number = ?, description = ? WHERE id = ?", 
            [weight, dimensions, type, origin, destination, trackingNumber, description, id]
        );
        if (result.affectedRows > 0) {
            console.log('Package details updated.');
        } else {
            console.log('No package found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating package:', error);
    }
}
//FOR TRACKING A PACKAGE (NOT SO SURE BOUT THIS - WILL MODIFY SOON)
async function trackPackage(trackingNumber) {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM package WHERE tracking_number = ?", 
            [trackingNumber]
        );
        if (rows.length > 0) {
            console.log('Package details:', rows[0]);
        } else {
            console.log('No package found with the given tracking number.');
        }
    } catch (error) {
        console.error('Error tracking package:', error);
    }
}

// REMOVING A PACKAGE
async function deletePackage(id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM package WHERE id = ?", 
            [id]
        );
        if (result.affectedRows > 0) {
            console.log('Package deleted.');
        } else {
            console.log('No package found with the given ID.');
        }
    } catch (error) {
        console.error('Error deleting package:', error);
    }
}
//LISTING ALL PACKAGES LIKE LITERALLY ALL
async function listAllPackages() {
    try {
        const [rows] = await pool.query("SELECT * FROM package");
        console.log('All Packages:', rows);
    } catch (error) {
        console.error('Error listing packages:', error);
    }
}






app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});