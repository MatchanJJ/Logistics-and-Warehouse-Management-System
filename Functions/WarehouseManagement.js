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

//FOR ADDDING A NEW WAREHOUSE
async function addWarehouse(id, location, capacity) {
    try {
        const [result] = await pool.query(
            "INSERT INTO warehouses (id, location, capacity) VALUES (?, ?, ?)", 
            [id, location, capacity]
        );
        console.log('Warehouse added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding warehouse:', error);
    }
}

//FOR UPDATING WAREHOUSE CAPACITY
async function updateWarehouseCapacity(id, newCapacity) {
    try {
        const [result] = await pool.query(
            "UPDATE warehouses SET capacity = ? WHERE id = ?", 
            [newCapacity, id]
        );
        if (result.affectedRows > 0) {
            console.log('Warehouse capacity updated.');
        } else {
            console.log('No warehouse found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating warehouse capacity:', error);
    }
}

//FOR CHECKING AVAILABLE CAPACITY
async function checkAvailableCapacity(id) {
    try {
        const [rows] = await pool.query(
            "SELECT capacity FROM warehouses WHERE id = ?", 
            [id]
        );
        if (rows.length > 0) {
            console.log(`Available capacity for warehouse ${id}:`, rows[0].capacity);
        } else {
            console.log('No warehouse found with the given ID.');
        }
    } catch (error) {
        console.error('Error checking available capacity:', error);
    }
}

//FOR VIEWING ALL ITEMS IN A WAREHOUSE
async function viewWarehouseInventory(id) {
    try {
        const [rows] = await pool.query(
            "SELECT package_id FROM warehouse_inventory WHERE warehouse_id = ?", 
            [id]
        );
        if (rows.length > 0) {
            console.log(`Inventory for warehouse ${id}:`, rows);
        } else {
            console.log('No inventory found for the given warehouse.');
        }
    } catch (error) {
        console.error('Error viewing warehouse inventory:', error);
    }
}
//FOR REMOVING PACKAGE FROM THE INVENTORY
async function removePackageFromInventory(warehouseId, packageId) {
    try {
        const [result] = await pool.query(
            "DELETE FROM warehouse_inventory WHERE warehouse_id = ? AND package_id = ?", 
            [warehouseId, packageId]
        );
        if (result.affectedRows > 0) {
            console.log('Package removed from inventory.');
        } else {
            console.log('No matching record found for the package in the warehouse.');
        }
    } catch (error) {
        console.error('Error removing package from inventory:', error);
    }
}



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});