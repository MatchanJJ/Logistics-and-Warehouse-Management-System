import pool from "./DBConnection.js";

// FINDING A SPECIFIC PRODUCT
async function findProduct(product_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM products WHERE product_id = ?", [product_id]);
        console.log(rows);
        return rows[0]; // Return the product details
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to handle it in the calling function
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
        return result.insertId; // Return the inserted product ID
    } catch (error) {
        console.error('Error inserting product:', error);
        throw error; // Rethrow the error to handle it in the calling function
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
        throw error; // Rethrow the error to handle it in the calling function
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
        throw error; // Rethrow the error to handle it in the calling function
    }
}

// LISTING ALL PRODUCTS
async function listAllProduct() {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        //console.log('All Products:', rows);
        return rows; // Return the list of products
    } catch (error) {
        console.error('Error listing products:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

// Exporting the product management functions
const productManagementToken = {
    findProduct,
    insertProduct,
    updateProduct,
    deleteProduct,
    listAllProduct
};

export default productManagementToken;
