import pool from "../DBConnection.js";
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

// EJS ROUTINGS

// Home route (List all shipments)
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM shipments");
        res.render('index', { shipments: rows });
    } catch (error) {
        res.status(500).send('Error retrieving shipments');
    }
});

// Route for adding a new shipment (form rendering)
app.get('/add-shipment', (req, res) => {
    res.render('add-shipment');
});

// Handle the form submission for adding a new shipment
app.post('/add-shipment', async (req, res) => {
    const { shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id } = req.body;

    try {
        await addShipment(shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding shipment');
    }
});

// Route for tracking a shipment by shipment status ID (rendering the tracking results)
app.get('/track-shipment', (req, res) => {
    res.render('track-shipment', { shipment: null });
});

// Handle tracking a shipment by shipment status ID
app.post('/track-shipment', async (req, res) => {
    const { shipment_status_id } = req.body;

    try {
        const [rows] = await trackShipment(shipment_status_id);
        if (rows.length > 0) {
            res.render('track-shipment', { shipment: rows[0] });
        } else {
            res.render('track-shipment', { shipment: null, message: 'No shipment found with the given status ID.' });
        }
    } catch (error) {
        res.status(500).send('Error tracking shipment');
    }
});

// DATABASE FUNCTIONS

// ADD SHIPMENT
async function addShipment(shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) {
    try {
        const [result] = await pool.query(
            "INSERT INTO shipments (shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id]
        );
        console.log('Shipment added with ID:', result.insertId);
    } catch (error) {
        console.error("Error adding shipment:", error);
    }
}

// TRACK SHIPMENT
async function trackShipment(shipment_status_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM shipments WHERE shipment_status_id = ?", [shipment_status_id]);
        return rows;
    } catch (error) {
        console.error("Error tracking shipment:", error);
    }
}

// LIST ALL SHIPMENTS
async function listAllShipment() {
    try {
        const [rows] = await pool.query("SELECT * FROM shipments");
        return rows;
    } catch (error) {
        console.error("Error listing shipments:", error);
    }
}

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
