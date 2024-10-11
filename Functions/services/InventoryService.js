import db from '../DBconnection/DBConnection.js';
import logger from '../utils/logUtil.js';
import whs from './WarehouseServices.js';

async function getInventory () {
    try {
        // update to show only parcel/product type, item_name, parcel/product ID, warehouse_id, warehouse_address, and warehouse_location, total_volume and quantity 
        const [rows] = await db.query (
            `SELECT 
                'Product' AS inventory_type,
                w.warehouse_address AS warehouse,
                w.warehouse_id AS warehouse_id,
                wl.section AS section,
                wl.aisle AS aisle,
                wl.rack AS rack,
                wl.shelf AS shelf,
                wl.bin AS bin,
                p.product_name AS item_name,
                p.product_brand AS brand,
                pi.quantity AS quantity,
                pi.total_volume AS total_volume,
                p.product_unit_price AS unit_price,
                (pi.quantity * p.product_unit_price) AS total_value,
                p.is_fragile AS fragile,
                p.is_perishable AS perishable,
                p.is_hazardous AS hazardous,
                p.is_oversized AS oversized,
                p.is_temperature_sensitive AS temperature_sensitive
            FROM 
                product_inventories pi
            JOIN 
                products p ON pi.product_id = p.product_id
            JOIN 
                warehouses w ON pi.warehouse_id = w.warehouse_id
            JOIN 
                warehouse_locations wl ON pi.warehouse_location_id = wl.warehouse_location_id

            UNION ALL

            SELECT 
                'Parcel' AS inventory_type,
                w.warehouse_address AS warehouse,
                w.warehouse_id AS warehouse_id,
                wl.section AS section,
                wl.aisle AS aisle,
                wl.rack AS rack,
                wl.shelf AS shelf,
                wl.bin AS bin,
                par.parcel_description AS item_name,
                NULL AS brand,
                pari.quantity AS quantity,
                pari.total_volume AS total_volume,
                par.parcel_unit_price AS unit_price,
                (pari.quantity * par.parcel_unit_price) AS total_value,
                par.is_fragile AS fragile,
                par.is_perishable AS perishable,
                par.is_hazardous AS hazardous,
                par.is_oversized AS oversized,
                par.is_temperature_sensitive AS temperature_sensitive
            FROM 
                parcel_inventories pari
            JOIN 
                parcels par ON pari.parcel_id = par.parcel_id
            JOIN 
                warehouses w ON pari.warehouse_id = w.warehouse_id
            JOIN 
                warehouse_locations wl ON pari.warehouse_location_id = wl.warehouse_location_id;
            `
        );
        return rows;
    } catch (error) {
        console.error('Error fetching inventory: ',error);
        return [];
    }
};

// assign product to warehouse and warehouse location
async function assignProduct(product_id, warehouse_id, section, aisle, rack, shelf, bin, quantity) {
    try {
        const [warehouse] = await db.query(`SELECT warehouse_type_id FROM warehouses WHERE warehouse_id = ?`, [warehouse_id]);

            if (!warehouse || warehouse.length === 0) {
                console.log('Warehouse not found.');
                return false;
            }

            const { warehouse_type_id } = warehouse[0];

            if (warehouse_type_id === 'WTY0000001') {
                console.log('Cannot assign product to postal warehouse.');
                return false;
            }

        if (await whs.isFull(warehouse_id)) {
            console.log(`Warehouse:${warehouse_id} is full. Cannot proceed to assignment.`)
            return false;
        }
        // Fetch product dimensions from the products table
        const [product] = await db.query(`
            SELECT product_length, product_width, product_height 
            FROM products 
            WHERE product_id = ?;
        `, [product_id]);

        if (product.length === 0) {
            console.error('Product not found');
            return false;  // Return or handle the case when the product doesn't exist
        }

        const { product_length, product_width, product_height } = product[0];
        
        // Calculate total volume (length * width * height) * quantity
        const total_volume = (product_length * product_width * product_height) * quantity;

        // Get warehouse location ID
        const warehouse_location_id = await whs.addWarehouseLocation(warehouse_id, section, aisle, rack, shelf, bin);

        // Insert into product_inventories
        const [result] = await db.query(`
            INSERT INTO product_inventories (product_id, warehouse_id, warehouse_location_id, quantity, total_volume) 
            VALUES (?, ?, ?, ?, ?);
        `, [product_id, warehouse_id, warehouse_location_id, quantity, total_volume]);

        console.log('Product assigned to warehouse:', product_id);
        const log_message = `Product:${product_id} assigned to warehouse:${warehouse_id}, located at ${warehouse_location_id}`;
        logger.addProductInventoryLog(product_id, warehouse_id, log_message);
        return true;  // Return the result of the insert operation
    } catch (error) {
        console.error('Error assigning product:', error);
        return false;
    }
};

// update product stock quantity
async function updateProductStockQuantity(product_id, warehouse_id, new_quantity) {
    try {
        const [result] = await db.query(
            `UPDATE product_inventories
            SET quantity = ?
            WHERE product_id = ? AND warehouse_id = ?;`,
            [new_quantity, product_id, warehouse_id]
        );
        if (result.affectedRows > 0) {
            console.log(`Stock quantity updated successfully for product: ${product_id} in warehouse: ${warehouse_id}.`);
            const log_message = `Stock quantity updated for product: ${product_id} in warehouse: ${warehouse_id}.`;
            logger.addProductInventoryLog(product_id, warehouse_id, log_message);
            return true;
        } else {
            console.log(`No product inventory found with ID: ${product_id}`);
            return false;
        }
    } catch (error) {
        console.error('Error updating product stock quantity:', error);
        return false;
    }
};
// update product location
async function updateProductLocation (product_id, warehouse_id, new_section, new_aisle, new_rack, new_shelf, new_bin) {
    console.log(warehouse_id,product_id);
    try {
        const [warehouse] = await db.query(`
            SELECT warehouse_location_id
            FROM product_inventories
            WHERE product_id = ? AND warehouse_id = ?;
            `, [product_id, warehouse_id]
        );
        if (warehouse.length === 0) {
            console.log('Warehouse location and warehouse not found.');
            return false;
        }
        const { warehouse_location_id } = warehouse[0];
        if (await whs.updateWarehouseLocation(warehouse_location_id, new_section, new_aisle, new_rack, new_shelf, new_bin)) {
            const log_message = 'Updated warehouse location.';
            logger.addProductInventoryLog(product_id, warehouse_id, log_message);
            return true;
        }
    } catch (error) {
        console.error('Error updating product location.');
        return false;
    }
};
// Remove assignment of product to warehouse and warehouse location
async function removeProductWarehouseLocation(product_id, warehouse_id) {
    try {
        // Get the product inventory details including warehouse_location_id and quantity
        const [rows] = await db.query(`
            SELECT warehouse_location_id, warehouse_id, quantity 
            FROM product_inventories 
            WHERE product_id = ? AND warehouse_id = ?;
        `, [product_id, warehouse_id]);

        if (rows.length === 0) {
            console.log(`No product ${product_id} in warehouse ${warehouse_id}`);
            return false;
        }

        const { warehouse_location_id, quantity } = rows[0];

        // Check if quantity is 0
        if (quantity === 0) {
            // First, remove the product from the product_inventories table
            const [result] = await db.query(`
                DELETE FROM product_inventories 
                WHERE product_id = ? AND warehouse_id = ?;
            `, [product_id, warehouse_id]);
            const log_message = `Removed assignment from warehouse:${warehouse_id}`;
            logger.addProductInventoryLog(product_id, null, log_message);
            if (result.affectedRows > 0) {
                console.log(`Product ${product_id} successfully removed from warehouse ${warehouse_id}.`);

                // After removing the product, remove the warehouse location
                const warehouseLocationRemoved = await whs.removeWarehouseLocation(warehouse_location_id);

                if (warehouseLocationRemoved) {
                    console.log(`Warehouse location with ID ${warehouse_location_id} successfully removed.`);
                    return true;
                } else {
                    console.log(`Failed to remove warehouse location with ID ${warehouse_location_id}.`);
                    return false;
                }
            } else {
                console.log(`Failed to remove product with inventory.`);
                return false;
            }
        } else {
            console.log(`Cannot remove product ${product_id} because the quantity is greater than 0.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing product from warehouse:', error);
        return false;
    }
};

// assign parcel to warehouse and warehouse location
const WAREHOUSE_TYPE_ECOMMERCE = 'WTY0000002'; // Constant for warehouse type

async function assignParcel(parcel_id, warehouse_id, section, aisle, rack, shelf, bin) {
    try {
        // Fetch warehouse type
        const [warehouse] = await db.query(`SELECT warehouse_type_id FROM warehouses WHERE warehouse_id = ?`, [warehouse_id]);

        if (!warehouse || warehouse.length === 0) {
            console.log('Warehouse not found.');
            return false;
        }

        const { warehouse_type_id } = warehouse[0];

        if (warehouse_type_id === WAREHOUSE_TYPE_ECOMMERCE) {
            console.log('Cannot assign parcel to e-commerce warehouse.');
            return false;
        }

        // Check if parcel is already assigned
        const [rows] = await db.query(`SELECT * FROM parcel_inventories WHERE parcel_id = ?;`, [parcel_id]);
        if (rows.length > 0) {
            console.log(`Parcel ${parcel_id} is already assigned to a warehouse.`);
            return false;
        }

        // Check if warehouse is full
        if (await whs.isFull(warehouse_id)) {
            console.log(`Warehouse:${warehouse_id} is full. Cannot proceed to assignment.`);
            return false;
        }

        // Fetch parcel dimensions
        const [parcel] = await db.query(`SELECT parcel_length, parcel_width, parcel_height FROM parcels WHERE parcel_id = ?;`, [parcel_id]);
        if (parcel.length === 0) {
            console.error('Parcel not found');
            return false;  // Handle case when the parcel doesn't exist
        }

        const { parcel_length, parcel_width, parcel_height } = parcel[0];
        const quantity = 1;

        // Calculate total volume
        const total_volume = (parcel_length * parcel_width * parcel_height) * quantity;

        // Assign to warehouse location and get ID
        const warehouse_location_id = await whs.addWarehouseLocation(warehouse_id, section, aisle, rack, shelf, bin);

        // Insert into parcel_inventories
        const [result] = await db.query(`
            INSERT INTO parcel_inventories (parcel_id, warehouse_id, warehouse_location_id, quantity, total_volume) 
            VALUES (?, ?, ?, ?, ?);
        `, [parcel_id, warehouse_id, warehouse_location_id, quantity, total_volume]);

        console.log('Parcel assigned to warehouse:', warehouse_id);
        const log_message = `Parcel:${parcel_id} assigned to warehouse:${warehouse_id}, located at warehouse_location:${warehouse_location_id}`;
        logger.addParcelInventoryLog(parcel_id, warehouse_id, log_message);
        return true;  // Return true if the operation was successful
    } catch (error) {
        console.error('Error assigning parcel:', error);
        throw error; // Optionally throw the error for higher-level handling
    }
}

// update parcel stock quantity -- usually either 1 or 0
async function updateParcelStockQuantity(parcel_id, warehouse_id, new_quantity) {
    try {
        const [result] = await db.query(
            `UPDATE parcel_inventories
            SET quantity = ?
            WHERE parcel_id = ? AND warehouse_id = ?;`,
            [new_quantity, parcel_id, warehouse_id]
        );
        if (result.affectedRows > 0) {
            console.log(`Stock quantity updated successfully for parcel: ${parcel_id} at warehouse: ${warehouse_id}`);
            const log_message = `Update stock quantity to ${new_quantity}`;
            logger.addParcelInventoryLog(parcel_id, warehouse_id, log_message);
            return true;
        } else {
            console.log(`No parcel inventory found with ID: ${parcel_id}`);
            return false;
        }
    } catch (error) {
        console.error('Error updating parcel stock quantity:', error);
        return false;
    }
};
// update parcel location
async function updateParcelLocation (parcel_id, warehouse_id, new_section, new_aisle, new_rack, new_shelf, new_bin) {
    try {
        const [warehouse] = await db.query(`
            SELECT warehouse_location_id
            FROM parcel_inventories
            WHERE parcel_id = ? AND warehouse_id = ?;
            `, [parcel_id, warehouse_id]
        );
        if (warehouse.length === 0) {
            console.log('Warehouse location and warehouse not found.');
            return false;
        }
        const { warehouse_location_id } = warehouse[0];
        if (await whs.updateWarehouseLocation(warehouse_location_id, new_section, new_aisle, new_rack, new_shelf, new_bin)) {
            const log_message = 'Updated warehouse location.';
            logger.addParcelInventoryLog(parcel_id, warehouse_id, log_message);
            return true;
        }
    } catch (error) {
        console.error('Error updating parcel location.');
        return false;
    }
};
// Remove assignment of parcel to warehouse and warehouse location
async function removeParcelWarehouseLocation(parcel_id, warehouse_id) {
    try {
        // Get the parcel inventory details including warehouse_location_id and quantity
        const [rows] = await db.query(`
            SELECT warehouse_location_id, warehouse_id, quantity 
            FROM parcel_inventories 
            WHERE parcel_id = ? AND warehouse_id = ?;
        `, [parcel_id, warehouse_id]);

        if (rows.length === 0) {
            console.log(`No parcel ${parcel_id} found in warehouse ${warehouse_id}`);
            return false;
        }

        const { warehouse_location_id, quantity } = rows[0];

        // Check if quantity is 0
        if (quantity === 0) {
            // First, remove the parcel from the parcel_inventories table
            const [result] = await db.query(`
                DELETE FROM parcel_inventories 
                WHERE parcel_id = ? AND warehouse_id = ?;
            `, [parcel_id, warehouse_id]);
            const log_message = `Removed assignment from warehouse:${warehouse_id}`;
            logger.addParcelInventoryLog(parcel_id, null, log_message);
            if (result.affectedRows > 0) {
                console.log(`Parcel ${parcel_id} successfully removed from warehouse ${warehouse_id}.`);

                // After removing the parcel, remove the warehouse location
                const warehouseLocationRemoved = await whs.removeWarehouseLocation(warehouse_location_id);

                if (warehouseLocationRemoved) {
                    console.log(`Warehouse location with ID ${warehouse_location_id} successfully removed.`);
                    return true;
                } else {
                    console.log(`Failed to remove warehouse location with ID ${warehouse_location_id}.`);
                    return false;
                }
            } else {
                console.log(`Failed to remove parcel with inventory ID ${parcel_inventory_id}.`);
                return false;
            }
        } else {
            console.log(`Cannot remove parcel with inventory ID ${parcel_inventory_id} because the quantity is greater than 0.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing parcel from warehouse:', error);
        return false;
    }
};

export default { 
    getInventory,
    assignProduct,
    updateProductStockQuantity,
    updateProductLocation,
    removeProductWarehouseLocation,
    assignParcel,
    updateParcelStockQuantity,
    updateParcelLocation,
    removeParcelWarehouseLocation
};