import db from '../DBConnection.js';
import idGen from './idGenerator.js';
import whlm from './WarehouseLocationManagement.js';

// assign product to warehouse and warehouse location
async function assignProduct(product_id, warehouse_id, section, aisle, rack, shelf, bin, quantity) {
    try {
        const newID = await idGen.generateID('product_inventories', 'product_inventory_id', 'PRI');
        console.log('New Product Inventory ID:', newID);

        // Fetch product dimensions from the products table
        const [product] = await db.query(`
            SELECT product_length, product_width, product_height 
            FROM products 
            WHERE product_id = ?;
        `, [product_id]);

        if (product.length === 0) {
            console.error('Product not found');
            return null;  // Return or handle the case when the product doesn't exist
        }

        const { product_length, product_width, product_height } = product[0];
        
        // Calculate total volume (length * width * height) * quantity
        const total_volume = (product_length * product_width * product_height) * quantity;

        // Get warehouse location ID
        const warehouse_location_id = await whlm.addWarehouseLocation(warehouse_id, section, aisle, rack, shelf, bin);

        // Insert into product_inventories
        const [result] = await db.query(`
            INSERT INTO product_inventories (product_inventory_id, warehouse_id, warehouse_location_id, product_id, quantity, total_volume) 
            VALUES (?, ?, ?, ?, ?, ?);
        `, [newID, warehouse_id, warehouse_location_id, product_id, quantity, total_volume]);

        console.log('Product assigned to warehouse:', result.insertId);
        return result;  // Return the result of the insert operation
    } catch (error) {
        console.error('Error assigning product:', error);
    }
};

// update product stock quantity
async function updateProductStockQuantity(product_inventory_id, new_quantity) {
    try {
        const [result] = await db.query(
            `UPDATE product_inventories
            SET quantity = ?
            WHERE product_inventory_id = ?;`,
            [new_quantity, product_inventory_id]
        );
        if (result.affectedRows > 0) {
            console.log(`Stock quantity updated successfully for product_inventory_id: ${product_inventory_id}`);
        } else {
            console.log(`No product inventory found with ID: ${product_inventory_id}`);
        }
        
        return result;
    } catch (error) {
        console.error('Error updating product stock quantity:', error);
    }
};

// Remove assignment of product to warehouse and warehouse location
async function removeProductWarehouseLocation(product_inventory_id) {
    try {
        // Get the product inventory details including warehouse_location_id and quantity
        const [rows] = await db.query(`
            SELECT warehouse_location_id, quantity 
            FROM product_inventories 
            WHERE product_inventory_id = ?;
        `, [product_inventory_id]);

        if (rows.length === 0) {
            console.log(`No product found with inventory ID: ${product_inventory_id}`);
            return false;
        }

        const { warehouse_location_id, quantity } = rows[0];

        // Check if quantity is 0
        if (quantity === 0) {
            // First, remove the product from the product_inventories table
            const [result] = await db.query(`
                DELETE FROM product_inventories 
                WHERE product_inventory_id = ?;
            `, [product_inventory_id]);

            if (result.affectedRows > 0) {
                console.log(`Product with inventory ID ${product_inventory_id} successfully removed from warehouse.`);

                // After removing the product, remove the warehouse location
                const warehouseLocationRemoved = await whlm.removeWarehouseLocation(warehouse_location_id);

                if (warehouseLocationRemoved) {
                    console.log(`Warehouse location with ID ${warehouse_location_id} successfully removed.`);
                    return true;
                } else {
                    console.log(`Failed to remove warehouse location with ID ${warehouse_location_id}.`);
                    return false;
                }
            } else {
                console.log(`Failed to remove product with inventory ID ${product_inventory_id}.`);
                return false;
            }
        } else {
            console.log(`Cannot remove product with inventory ID ${product_inventory_id} because the quantity is greater than 0.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing product from warehouse:', error);
        return false;
    }
};

// test

const token_manager =  { assignProduct, updateProductStockQuantity, removeProductWarehouseLocation };
export default token_manager;
