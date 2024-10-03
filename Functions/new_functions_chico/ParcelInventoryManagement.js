import db from '../dbConnection/DBConnection.js';
import idGen from './idGenerator.js';
import whlm from './WarehouseLocationManagement.js';

// assign parcel to warehouse and warehouse location
async function assignParcel (parcel_id, warehouse_id, section, aisle, rack, shelf, bin, quantity) {
    try {
        const newID = await idGen.generateID('parcel_inventories', 'parcel_inventory_id', 'PIN');
        console.log('New parcel Inventory ID:', newID);

        // Fetch parcel dimensions from the parcels table
        const [parcel] = await db.query(`
            SELECT parcel_length, parcel_width, parcel_height 
            FROM parcels 
            WHERE parcel_id = ?;
        `, [parcel_id]);

        if (parcel.length === 0) {
            console.error('parcel not found');
            return null;  // Return or handle the case when the parcel doesn't exist
        }

        const { parcel_length, parcel_width, parcel_height } = parcel[0];
        
        // Calculate total volume (length * width * height) * quantity
        const total_volume = (parcel_length * parcel_width * parcel_height) * quantity;

        // Get warehouse location ID
        const warehouse_location_id = await whlm.addWarehouseLocation(warehouse_id, section, aisle, rack, shelf, bin, quantity);

        // Insert into parcel_inventories
        const [result] = await db.query(`
            INSERT INTO parcel_inventories (parcel_inventory_id, warehouse_id, warehouse_location_id, parcel_id, quantity, total_volume) 
            VALUES (?, ?, ?, ?, ?, ?);
        `, [newID, warehouse_id, warehouse_location_id, parcel_id, quantity, total_volume]);

        console.log('Parcel assigned to warehouse:', result.insertId);
        return result;  // Return the result of the insert operation
    } catch (error) {
        console.error('Error assigning parcel:', error);
    }
};

// update parcel stock quantity -- usually either 1 or 0
async function updateParcelStockQuantity(parcel_inventory_id, new_quantity) {
    try {
        const [result] = await db.query(
            `UPDATE parcel_inventories
            SET quantity = ?
            WHERE parcel_inventory_id = ?;`,
            [new_quantity, parcel_inventory_id]
        );
        if (result.affectedRows > 0) {
            console.log(`Stock quantity updated successfully for parcel_inventory_id: ${parcel_inventory_id_inventory_id}`);
        } else {
            console.log(`No parcel inventory found with ID: ${parcel_inventory_id}`);
        }
        
        return result;
    } catch (error) {
        console.error('Error updating parcel stock quantity:', error);
    }
};

// Remove assignment of parcel to warehouse and warehouse location
async function removeParcelWarehouseLocation(parcel_inventory_id) {
    try {
        // Get the parcel inventory details including warehouse_location_id and quantity
        const [rows] = await db.query(`
            SELECT warehouse_location_id, quantity 
            FROM parcel_inventories 
            WHERE parcel_inventory_id = ?;
        `, [parcel_inventory_id]);

        if (rows.length === 0) {
            console.log(`No parcel found with inventory ID: ${parcel_inventory_id}`);
            return false;
        }

        const { warehouse_location_id, quantity } = rows[0];

        // Check if quantity is 0
        if (quantity === 0) {
            // First, remove the parcel from the parcel_inventories table
            const [result] = await db.query(`
                DELETE FROM parcel_inventories 
                WHERE parcel_inventory_id = ?;
            `, [parcel_inventory_id]);

            if (result.affectedRows > 0) {
                console.log(`parcel with inventory ID ${parcel_inventory_id} successfully removed from warehouse.`);

                // After removing the parcel, remove the warehouse location
                const warehouseLocationRemoved = await whlm.removeWarehouseLocation(warehouse_location_id);

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

// test

const token_manager =  { assignParcel, updateParcelStockQuantity, removeParcelWarehouseLocation };
export default token_manager;
