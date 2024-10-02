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

const productManagementToken = {
    findProduct,
    insertProduct,
    updateProduct,
    deleteProduct,
    listAllProduct
}
// EJS ROUTINGS

// Home route (Display all products)
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        res.render('index', { products: rows });
    } catch (error) {
        res.status(500).send('Error retrieving products');
    }
});

// Route for displaying a single product by ID
app.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE product_id = ?", [productId]);
        if (rows.length > 0) {
            res.render('product', { product: rows[0] });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving product');
    }
});

// Route for adding a new product (form rendering)
app.get('/add-product', (req, res) => {
    res.render('add-product');
});

// Handle the form submission for adding a new product
app.post('/add-product', async (req, res) => {
    const {
        product_id, product_category_id, product_name, product_brand, product_supplier,
        product_description, product_unit_price, product_weight, product_length,
        product_width, product_height, is_fragile, is_perishable, is_hazardous,
        is_oversized, is_returnable, is_temperature_sensitive
    } = req.body;

    try {
        await insertProduct(product_id, product_category_id, product_name, product_brand, product_supplier,
            product_description, product_unit_price, product_weight, product_length, product_width,
            product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive);

        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error inserting product');
    }
});

// Route for updating a product (render form with existing data)
app.get('/edit-product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE product_id = ?", [productId]);
        if (rows.length > 0) {
            res.render('edit-product', { product: rows[0] });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving product for update');
    }
});

// Handle the form submission for updating a product
app.post('/edit-product/:id', async (req, res) => {
    const productId = req.params.id;
    const {
        product_category_id, product_name, product_brand, product_supplier,
        product_description, product_unit_price, product_weight, product_length,
        product_width, product_height, is_fragile, is_perishable, is_hazardous,
        is_oversized, is_returnable, is_temperature_sensitive
    } = req.body;

    try {
        await updateProduct(product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, productId);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

// Route for deleting a product
app.post('/delete-product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        await deleteProduct(productId);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
});

// DATABASE FUNCTIONS (unchanged from your original code)

// FINDING A SPECIFIC PRODUCT
async function findProduct(product_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE product_id = ?", [product_id]);
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}

// REGISTER NEW PRODUCT
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

// FOR UPDATING A PRODUCT
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

// DELETING A PRODUCT
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

// LISTING ALL PRODUCTS
async function listAllProduct() {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        console.log('All Products:', rows);
    } catch (error) {
        console.error('Error listing product:', error);
    }
}

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default productManagementToken;