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


//ADD SHIPMENT
async function addShipment (shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) {
    try {
        const [result] = await pool.query(
            "INSERT INTO shipments (shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id]
        );
    } catch (error) {
        console.error("err")
    }
    
}

//TRACK SHIPMENT
async function trackShipment(shipment_status_id) {
    try {
        const [result] = await pool.query(
            "SELECT * FROM shipments WHERE shipment_status_id = ?",[shipment_status_id]
        )
    } catch (error) {
        
    }
}

async function ListAllShipment() {
    try {
        const [result] = await pool.query(
            "SELECT * FROM shipments"
        )
    } catch (error) {
        
    }
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});