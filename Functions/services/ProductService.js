import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import archiver from '../utils/archiveUtil.js';
import logger from '../utils/logUtil.js';
import inServ from './InventoryService.js';

// get all products record list
async function getProducts () {
    try {
        const [rows] = await db.query(`
            SELECT
                p.product_id,
                p.product_name,
                p.product_brand,
                p.product_supplier,
                p.product_description,
                p.product_unit_price,
                p.product_weight,
                p.product_length,
                p.product_width,
                p.product_height,
                pc.product_category_name AS category_name
            FROM products p
            JOIN product_categories pc ON p.product_category_id = pc.product_category_id;
        `);
        return rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

// view product record details
async function viewProduct (product_id) {
    try {
        const [rows] = await db.query(`
            SELECT
                p.product_id,
                pc.product_category_id,
                p.product_name,
                p.product_brand,
                p.product_supplier,
                p.product_description,
                p.product_unit_price,
                p.product_weight,
                p.product_length,
                p.product_width,
                p.product_height,
                p.is_fragile,
                p.is_perishable,
                p.is_hazardous,
                p.is_oversized,
                p.is_returnable,
                p.is_temperature_sensitive,
                pc.product_category_name AS category_name
            FROM products p
            JOIN product_categories pc ON p.product_category_id = pc.product_category_id
            WHERE p.product_id = ?;
        `, [product_id]);
         
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error finding product:', error);
        return null;
    }
};

// add new product record
async function addProduct (product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) {
    try {
        const newID = await idGen.generateID('products', 'product_id', 'PRD');
        console.log(newID);
        const [result] = await db.query(
            `INSERT INTO products (product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newID, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive]
        );
        if (result.affectedRows > 0) {
            console.log('Product inserted with ID:', newID);
            const log_message = `Product inserted with ID ${newID}.`;
            logger.addProductInventoryLog(newID, null, log_message);
            return true;
        } else {
            console.log('Error adding new product record.');
            return false;
        }
    } catch (error) {
        console.error('Error inserting product:', error);
    }
};

// update product details
async function updateProduct(product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, product_id) {
    try {

        const [result] = await db.query(
            `UPDATE products SET product_category_id = ?, product_name = ?, product_brand = ?, product_supplier = ?, product_description = ?, product_unit_price = ?, product_weight = ?, product_length = ?, product_width = ?, product_height =?, is_fragile = ?, is_perishable = ?, is_hazardous = ?, is_oversized = ?, is_returnable = ?, is_temperature_sensitive = ? WHERE product_id = ?`,
            [product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, product_id]
        );
        if (result.affectedRows > 0) {
            console.log('Product details updated.');
            const log_message = `Product ${product_id} details updated.`;
            logger.addProductInventoryLog(product_id, null, log_message);
            return true;
        } else {
            console.log('No product found with the given ID.');
            return false;
        }
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
};

// remove / delete product record
async function removeProduct(product_id) { 
    try {
        // Check if the product exists in the inventory and get its quantity and warehouse location
        const [inventory] = await db.query(`
            SELECT warehouse_id, warehouse_location_id, quantity 
            FROM product_inventories 
            WHERE product_id = ?;
        `, [product_id]);

        if (Array.isArray(inventory) && inventory.length > 0) {
            // Calculate the total quantity of the product across all inventories
            const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);

            // If the product still has stock, prevent the deletion
            if (totalQuantity > 0) {
                console.log(`Cannot remove product. Quantity in inventory is ${totalQuantity}.`);
                return false; 
            }

            // If no stock, remove associated product_inventories using the removeProductWarehouseLocation function
            for (const item of inventory) {
                const { warehouse_id, warehouse_location_id } = item;
                const result = await inServ.removeProductWarehouseLocation(product_id, warehouse_id);

                if (!result) {
                    console.log(`Failed to remove warehouse location with ID ${warehouse_location_id}`);
                    return false;
                }
            }

            console.log(`Successfully removed all product inventories for product ID: ${product_id}`);
        } else {
            console.log(`Product not found in inventory. Proceeding to delete.`);
        }

        // archive and remove the product record
        if (await archiver.archiveProduct(product_id)) {
            const [result] = await db.query(`
                DELETE FROM products 
                WHERE product_id = ?;
            `, [product_id]);
    
            if (result.affectedRows > 0) {
                console.log('Product successfully deleted.');
                return true;  
            } else {
                console.log('No product found with the given ID.');
                return false;  
            }
        } else {
            console.error('Error archiving and deleting product:', error);
            return false;
        }
    } catch (error) {
        console.error('Error removing product:', error);
        return false;  
    }
};

const ProductServiceToken = {
    getProducts,
    viewProduct,
    addProduct,
    updateProduct,
    removeProduct
};
export default  ProductServiceToken;