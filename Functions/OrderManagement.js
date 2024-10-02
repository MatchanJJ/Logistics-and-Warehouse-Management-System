import pool from "./DBConnection.js";
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

const orderTokens = {
    addPostalOrders,
    updatePostalOrders,
    addProductOrders,
    updateProductOrders,
}
// POSTAL ORDERS

// ADD POSTAL ORDER
async function addPostalOrders(postal_order_id, order_id, parcel_id, total_price) {
    try {
        const [result] = await pool.query(
            "INSERT INTO postal_orders (postal_order_id, order_id, parcel_id, total_price) VALUES (?, ?, ?, ?)", 
            [postal_order_id, order_id, parcel_id, total_price]
        );
        console.log('Postal order added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding postal order:', error);
    }
}

// UPDATE POSTAL ORDER
async function updatePostalOrders(order_id, parcel_id, total_price, postal_order_id) {
    try {
        const [result] = await pool.query(
            "UPDATE postal_orders SET order_id = ?, parcel_id = ?, total_price = ? WHERE postal_order_id = ?", 
            [order_id, parcel_id, total_price, postal_order_id]
        );
        if (result.affectedRows > 0) {
            console.log('Postal order updated.');
        } else {
            console.log('No postal order found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating postal order:', error);
    }
}

// PRODUCT ORDERS

// ADD PRODUCT ORDER
async function addProductOrders(product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price) {
    try {
        const [result] = await pool.query(
            "INSERT INTO product_orders (product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)", 
            [product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price]
        );
        console.log('Product order added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding product order:', error);
    }
}

// UPDATE PRODUCT ORDER
async function updateProductOrders(order_id, product_id, product_quantity, product_unit_price, total_price, product_order_id) {
    try {
        const [result] = await pool.query(
            "UPDATE product_orders SET order_id = ?, product_id = ?, product_quantity = ?, product_unit_price = ?, total_price = ? WHERE product_order_id = ?", 
            [order_id, product_id, product_quantity, product_unit_price, total_price, product_order_id]
        );
        if (result.affectedRows > 0) {
            console.log('Product order updated.');
        } else {
            console.log('No product order found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating product order:', error);
    }
}

// ROUTES

// Home page listing postal and product orders
app.get('/', async (req, res) => {
    try {
        const [postalOrders] = await pool.query("SELECT * FROM postal_orders");
        const [productOrders] = await pool.query("SELECT * FROM product_orders");
        res.render('index', { postalOrders, productOrders });
    } catch (error) {
        res.status(500).send('Error fetching orders.');
    }
});

// Add postal order form
app.get('/add-postal-order', (req, res) => {
    res.render('add-postal-order');
});

app.post('/add-postal-order', async (req, res) => {
    const { postal_order_id, order_id, parcel_id, total_price } = req.body;
    try {
        await addPostalOrders(postal_order_id, order_id, parcel_id, total_price);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding postal order.');
    }
});

// Add product order form
app.post('/add-product-order', async (req, res) => {
    const { product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price } = req.body;
    
    try {
        // Call the function to add the product order
        await addProductOrders(product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price);
        
        // Log the order action after adding the product order
        const description = `Added product order with ID: ${product_order_id} for order: ${order_id}`;
        const orderStatusId = 1;  // we should probably automate it 
        const logSuccess = await logOrderAction(order_id, orderStatusId, description);
        
        if (logSuccess) {
            console.log('Order action logged successfully.');
        } else {
            console.log('Failed to log order action.');
        }

        // Redirect or send response after the action
        res.redirect('/');
        
    } catch (error) {
        // Handle any errors and send an error response
        console.error('Error adding product order or logging action:', error);
        res.status(500).send('Error adding product order.');
    }
});


// Update postal order form
app.get('/update-postal-order/:id', async (req, res) => {
    const postal_order_id = req.params.id;
    try {
        const [postalOrders] = await pool.query("SELECT * FROM postal_orders WHERE postal_order_id = ?", [postal_order_id]);
        if (postalOrders.length > 0) {
            res.render('update-postal-order', { postalOrder: postalOrders[0] });
        } else {
            res.status(404).send('Postal order not found.');
        }
    } catch (error) {
        res.status(500).send('Error fetching postal order.');
    }
});

app.post('/update-postal-order/:id', async (req, res) => {
    const { order_id, parcel_id, total_price } = req.body;
    const { id: postal_order_id } = req.params;
    try {
        await updatePostalOrders(order_id, parcel_id, total_price, postal_order_id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating postal order.');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default orderTokens;