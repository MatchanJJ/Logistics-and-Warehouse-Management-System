import db from '../dbConnection/DBConnection.js';
import idGen from './idGenerator.js';

// add new location for item
async function addWarehouseLocation(warehouse_id, section, aisle, rack, shelf, bin) {
    try {
        const newID = await idGen.generateID('warehouse_locations', 'warehouse_location_id', 'WLO');
        console.log(newID);
        const [result] = await db.query(
            `INSERT INTO warehouse_locations (warehouse_location_id, warehouse_id, section, aisle, rack, shelf, bin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [newID, warehouse_id, section, aisle, rack, shelf, bin]
        );
        console.log('New warehouse location added:', result.insertId);
        return newID;
    } catch (error) {
        console.error('Error adding warehouse location:', error);
    }
};

// update location for item
async function updateWarehouseLocation(warehouse_location_id, new_section, new_aisle, new_rack, new_shelf, new_bin) {
    try {
        const [result] = await db.query(`
            UPDATE warehouse_locations 
            SET section = ?, aisle = ?, rack = ?, shelf = ?, bin = ?
            WHERE warehouse_location_id = ?;
        `, [new_section, new_aisle, new_rack, new_shelf, new_bin, warehouse_location_id]);

        if (result.affectedRows > 0) {
            console.log(`Warehouse location with ID ${warehouse_location_id} updated successfully.`);
            return true;
        } else {
            console.log(`No warehouse location found with ID: ${warehouse_location_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating warehouse location:', error);
        return false;
    }
};

// remove warehouse_location only called when removing product, or product_warehouse_location
async function removeWarehouseLocation(warehouse_location_id) {
    try {
        const [rows] = await db.query(`
            SELECT quantity 
            FROM product_inventories 
            WHERE warehouse_location_id = ?;
        `, [warehouse_location_id]);

        if (rows.length === 0) {
            console.log(`No product found in inventory for warehouse location ID: ${warehouse_location_id}`);           
            const [result] = await db.query(`
                DELETE FROM warehouse_locations 
                WHERE warehouse_location_id = ?;
            `, [warehouse_location_id]);

            if (result.affectedRows > 0) {
                console.log(`Warehouse location with ID ${warehouse_location_id} successfully removed.`);
                return true;
            } else {
                console.log(`Failed to remove warehouse location with ID ${warehouse_location_id}.`);
                return false;
            }
        }

        const { quantity } = rows[0];
        if (quantity > 0) {
            console.log(`Cannot remove warehouse location with ID ${warehouse_location_id} because there are products with quantity > 0.`);
            return false;
        }

        const [result] = await db.query(`
            DELETE FROM warehouse_locations 
            WHERE warehouse_location_id = ?;
        `, [warehouse_location_id]);

        if (result.affectedRows > 0) {
            console.log(`Warehouse location with ID ${warehouse_location_id} successfully removed.`);
            return true;
        } else {
            console.log(`Failed to remove warehouse location with ID ${warehouse_location_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing warehouse location:', error);
        return false;
    }
};

export default { addWarehouseLocation, updateWarehouseLocation, removeWarehouseLocation };