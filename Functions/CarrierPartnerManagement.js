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

// ADD NEW PARTNER
async function addCarrierPartner(carrier_id, carrier_name, shipping_service_id, carrier_contact_info) {
    try {
        const [result] = await pool.query(
            "INSERT INTO carriers (carrier_id, carrier_name, shipping_service_id, carrier_contact_info) VALUES (?, ?, ?, ?)", 
            [carrier_id, carrier_name, shipping_service_id, carrier_contact_info]
        );
        console.log('Logistics Partner added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding logistics partner:', error);
    }
}

//UPDATING LOGISTIC PARTNER
async function updateLogisticsPartner(carrier_name, shipping_service_id, carrier_contact_info, carrier_id) {
    try {
        const [result] = await pool.query(
            "UPDATE carriers SET carrier_name = ?, shipping_service_id = ?, carrier_contact_info = ?, WHERE carrier_id = ?", 
            [carrier_name, shipping_service_id, carrier_contact_info, carrier_id]
        );
        if (result.affectedRows > 0) {
            console.log('Logistics Partner details updated.');
        } else {
            console.log('No logistics partner found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating logistics partner details:', error);
    }
}

// VIEWING A PARTNERS
async function viewLogisticsPartner(carrier_id) {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM carriers WHERE id = ?", 
            [carrier_id]
        );
        if (rows.length > 0) {
            console.log('Logistics Partner details:', rows[0]);
        } else {
            console.log('No logistics partner found with the given ID.');
        }
    } catch (error) {
        console.error('Error fetching logistics partner details:', error);
    }
}

//REMOVE A PARTNER
async function deleteLogisticsPartner(carrier_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM carriers WHERE id = ?", 
            [carrier_id]
        );
        if (result.affectedRows > 0) {
            console.log('Logistics Partner deleted.');
        } else {
            console.log('No logistics partner found with the given ID.');
        }
    } catch (error) {
        console.error('Error deleting logistics partner:', error);
    }
}

//LIST ALL PARTNER
async function listAllLogisticsPartners() {
    try {
        const [rows] = await pool.query("SELECT * FROM carriers");
        console.log('All Logistics Partners:', rows);
    } catch (error) {
        console.error('Error listing logistics partners:', error);
    }
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});