import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import employeeManagementToken from './EmployeeManagement.js';
import warehouseManagementToken from './WarehouseManagement.js';

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const port = 3000;

// Middleware to parse request bodies (for POST requests)
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory and view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Home route (blank or simple welcome message)
app.get('/', (req, res) => {
    res.render('layout', {
        title: 'Home',
        content: 'home'  // Render the blank home page
    });
});

// Example employee route (ensure your module works)
app.get('/employees', async (req, res) => {
    try {
        const employees = await employeeManagementToken.listAllEmployees();
        res.render('layout', {
            title: 'Employee List',
            content: 'employee',
            employees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);  // Log the error to the console
        res.status(500).send('Error fetching employees.');
    }
});
app.get('/warehouses', async (req, res) => {
    try {
        const employees = await warehouseManagementToken.listAllWarehouse();
        res.render('layout', {
            title: 'Warehouse List',
            content: 'warehouses',
            warehouses
        });
    } catch (error) {
        console.error('Error fetching employees:', error);  // Log the error to the console
        res.status(500).send('Error fetching employees.');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
