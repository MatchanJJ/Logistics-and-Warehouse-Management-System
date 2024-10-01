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

//POSTAL ORDERS

//ADD POSTAL ORDERS
async function addPostalOrders(postal_order_id, order_id, parcel_id, total_price) {
    try {
        const [result] = await pool.query(
            "INSERT INTO postal_orders (postal_order_id, order_id, parcel_id, total_price) VALUES (?, ?, ?, ?)", 
            [postal_order_id, order_id, parcel_id, total_price]
        );
    } catch (error) {
        
    }
}

//UPDATE POSTAL ORDERS
async function updatePostalOrders(order_id, parcel_id, total_price, postal_order_id ) {
    try {
        const [result] = await pool.query(
            "UPDATE postal_orders SET order_id = ?, parcel_id = ?, total_price = ? WHERE postal_order_id = ?", 
            [order_id, parcel_id, total_price, postal_order_id]
        );
    } catch (error) {
        
    }
}

//PRODUCT ORDERS

// ADD PRODUCT ORDERS
async function addProductOrders(product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price) {
    try {
        const [result] = await pool.query(
            "INSERT INTO postal_orders (product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)", 
            [product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price]
        );
    } catch (error) {
        
    }
}

//UPDATE PRODUCT ORDERS
async function updateProductOrders(order_id, product_id, product_quantity, product_unit_price, total_price, product_order_id) {
    try {
        const [result] = await pool.query(
            "UPDATE postal_orders SET order_id = ?, product_id = ?, product_quantity = ?, product_unit_price = ?, total_price = ? WHERE product_order_id = ?", 
            [order_id, product_id, product_quantity, product_unit_price, total_price, product_order_id]
        );
    } catch (error) {
        
    }
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});