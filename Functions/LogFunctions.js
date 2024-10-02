import pool from "./DBConnection.js";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Middleware to parse request bodies (if you're handling form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory and view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

const { v4: uuidv4 } = require('uuid');
//WILL CHANGE DEPENDING ON THE ID CONVENTION
function generateUniqueId() {
    return uuidv4();
}

// Log Employee Action
async function logEmployeeAction(employeeId, description) {
    try {
        const query = `INSERT INTO employee_logs (employee_log_id, date_time, employee_id, employee_log_description)
                       VALUES (?, NOW(), ?, ?)`;
        const logId = generateUniqueId(); // function to generate a unique ID
        const [result] = await pool.query(query, [logId, employeeId, description]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Log Order Action
async function logOrderAction(orderId, orderStatusId, description) {
    try {
        const query = `INSERT INTO order_logs (order_log_id, date_time, order_id, order_status_id, order_log_description)
                       VALUES (?, NOW(), ?, ?, ?)`;
        const logId = generateUniqueId(); // function to generate a unique ID
        const [result] = await pool.query(query, [logId, orderId, orderStatusId, description]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Log Shipment Action
async function logShipmentAction(shipmentId, description) {
    try {
        const query = `INSERT INTO shipment_logs (shipment_log_id, date_time, shipment_id, shipment_log_description)
                       VALUES (?, NOW(), ?, ?)`;
        const logId = generateUniqueId(); // function to generate a unique ID
        const [result] = await pool.query(query, [logId, shipmentId, description]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Log Parcel Inventory Action
async function logParcelInventoryAction(parcelInventoryId, warehouseId, description) {
    try {
        const query = `INSERT INTO parcel_inventory_logs (parcel_inventory_log_id, date_time, parcel_inventory_id, warehouse_id, parcel_inventory_log_description)
                       VALUES (?, NOW(), ?, ?, ?)`;
        const logId = generateUniqueId(); // function to generate a unique ID
        const [result] = await pool.query(query, [logId, parcelInventoryId, warehouseId, description]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Log Product Inventory Action
async function logProductInventoryAction(productInventoryId, warehouseId, description) {
    try {
        const query = `INSERT INTO product_inventory_logs (product_inventory_log_id, date_time, product_inventory_id, warehouse_id, product_inventory_log_description)
                       VALUES (?, NOW(), ?, ?, ?)`;
        const logId = generateUniqueId(); // function to generate a unique ID
        const [result] = await pool.query(query, [logId, productInventoryId, warehouseId, description]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Log Return Action
async function logReturnAction(returnId, description) {
    try {
        const query = `INSERT INTO return_logs (return_log_id, date_time, return_id, return_log_description)
                       VALUES (?, NOW(), ?, ?)`;
        const logId = generateUniqueId(); // function to generate a unique ID
        const [result] = await pool.query(query, [logId, returnId, description]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
