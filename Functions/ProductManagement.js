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
async function findProduct(product_id) {                    
    try {
        const [rows, fields] = await pool.query("SELECT * FROM products WHERE product_id = ?",[product_id]);
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}

//REGISTER NEW PACKAGE
async function insertProduct(product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) {
    try {
        const [result] = await pool.query(
            "INSERT INTO products (product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive]
        );
        console.log('Product inserted with ID:', result.insertId);
    } catch (error) {
        console.error('Error inserting product:', error);
    }
}

// FOR UPDATING A PACKAGE
async function updateProduct(product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, product_id) {
    try {
        const [result] = await pool.query(
            "UPDATE products SET product_category_id = ?, product_name = ?, product_brand = ?, product_supplier = ?, product_description = ?, product_unit_price = ?, product_weight = ?, product_length = ?, product_width = ?, product_height =?, is_fragile = ?, is_perishable = ?, is_hazardous = ?, is_oversized = ?, is_returnable = ?, is_temperature_sensitive = ? WHERE product_id = ?", 
            [product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, product_id]
        );
        if (result.affectedRows > 0) {
            console.log('Product details updated.');
        } else {
            console.log('No product found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
}
//FOR TRACKING A PACKAGE (NOT SO SURE BOUT THIS - WILL MODIFY SOON)
//async function trackPackage(trackingNumber) {
//    try {
//        const [rows] = await pool.query(
//            "SELECT * FROM package WHERE tracking_number = ?", 
//            [trackingNumber]
//        );
//        if (rows.length > 0) {
//            console.log('Package details:', rows[0]);
//        } else {
//            console.log('No package found with the given tracking number.');
//        }
//    } catch (error) {
//        console.error('Error tracking package:', error);
//    }
//}

// REMOVING A PACKAGE
async function deleteProduct(product_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM products WHERE product_id = ?", 
            [product_id]
        );
        if (result.affectedRows > 0) {
            console.log('Product deleted.');
        } else {
            console.log('No product found with the given ID.');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}
//LISTING ALL PACKAGES LIKE LITERALLY ALL
async function listAllProduct() {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        console.log('All Products:', rows);
    } catch (error) {
        console.error('Error listing product:', error);
    }
}






app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});