import pool from "./DBConnection.js";
import express from 'express';
import path from 'path';  // Import the path module
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Middleware to parse request bodies (for POST requests)
app.use(express.urlencoded({ extended: true }));

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory (adjust the path as necessary)
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// ROUTES

// Home route (List all warehouses)
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM warehouses");
        res.render('index', { warehouses: rows });
    } catch (error) {
        res.status(500).send('Error retrieving warehouses');
    }
});

// Route for adding a new warehouse (form rendering)
app.get('/add-warehouse', (req, res) => {
    res.render('add-warehouse');
});

// Handle the form submission for adding a new warehouse
app.post('/add-warehouse', async (req, res) => {
    const { id, location, capacity } = req.body;

    try {
        await addWarehouse(id, location, capacity);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding warehouse');
    }
});

// Route for updating warehouse capacity (form rendering)
app.get('/update-warehouse-capacity/:id', (req, res) => {
    const { id } = req.params;
    res.render('update-warehouse-capacity', { id });
});

// Handle the form submission for updating warehouse capacity
app.post('/update-warehouse-capacity', async (req, res) => {
    const { id, newCapacity } = req.body;

    try {
        await updateWarehouseCapacity(id, newCapacity);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating warehouse capacity');
    }
});

// Route for checking available capacity (rendering the result)
app.get('/check-available-capacity/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await checkAvailableCapacity(id);
        res.render('check-available-capacity', { capacity: rows[0].capacity, id });
    } catch (error) {
        res.status(500).send('Error checking available capacity');
    }
});

// Route for viewing warehouse inventory (rendering the inventory)
app.get('/view-warehouse-inventory/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await viewWarehouseInventory(id);
        res.render('view-warehouse-inventory', { inventory: rows, id });
    } catch (error) {
        res.status(500).send('Error viewing warehouse inventory');
    }
});

// Route for removing a package from the inventory (form rendering)
app.get('/remove-package', (req, res) => {
    res.render('remove-package');
});

// Handle the form submission for removing a package from inventory
app.post('/remove-package', async (req, res) => {
    const { warehouseId, packageId } = req.body;

    try {
        await removePackageFromInventory(warehouseId, packageId);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error removing package from inventory');
    }
});

// DATABASE FUNCTIONS

// ADD WAREHOUSE
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

// UPDATE WAREHOUSE CAPACITY
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

// CHECK AVAILABLE CAPACITY
async function checkAvailableCapacity(id) {
    try {
        const [rows] = await pool.query(
            "SELECT capacity FROM warehouses WHERE id = ?",
            [id]
        );
        return rows;
    } catch (error) {
        console.error('Error checking available capacity:', error);
    }
}

// VIEW WAREHOUSE INVENTORY
async function viewWarehouseInventory(id) {
    try {
        const [rows] = await pool.query(
            "SELECT package_id FROM warehouse_inventory WHERE warehouse_id = ?",
            [id]
        );
        return rows;
    } catch (error) {
        console.error('Error viewing warehouse inventory:', error);
    }
}

// REMOVE PACKAGE FROM INVENTORY
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

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
