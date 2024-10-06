import db from '../DBConnection.js';
import idGen from './idGenerator.js';
//import parcima from './ParcelInventoryManagement.js';

// get all parcels record list
async function getParcels () {
    try {
        const [rows] = await db.query(`
            SELECT
                p.parcel_id,
                p.parcel_description,
                p.parcel_unit_price,
                p.parcel_weight,
                p.parcel_length,
                p.parcel_width,
                p.parcel_height,
                pc.parcel_category_name AS category_name
            FROM parcels p
            JOIN parcel_categories pc ON p.parcel_category_id = pc.parcel_category_id;
        `);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error fetching parcels:', error);
    }
};

// view parcel record details
async function viewParcel (parcel_id) {
    try {
        const [rows] = await db.query(`
            SELECT
                p.parcel_id,
                p.parcel_description,
                p.parcel_weight,
                p.parcel_length,
                p.parcel_width,
                p.parcel_height,
                p.is_fragile,
                p.is_perishable,
                p.is_hazardous,
                p.is_oversized,
                p.is_returnable,
                pc.parcel_category_name AS category_name
            FROM parcels p
            JOIN parcel_categories pc ON p.parcel_category_id = pc.parcel_category_id
            WHERE p.parcel_id = ?;
        `, [parcel_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error finding parcel:', error);
        return null;  // Return null if there was an error
    }
};


// add new parcel record -- when customer creates a postal order
async function addParcel (parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) {
    try {
        const newID = await idGen.generateID('parcels', 'parcel_id', 'PAR');
        console.log(newID);
        const [result] = await db.query(
            `INSERT INTO parcels (parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newID, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive]
        );
        console.log('Parcel inserted with ID:', newID);
    } catch (error) {
        console.error('Error inserting parcel:', error);
    }
};

 // update parcel details
 async function updateParcel(parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, parcel_id) {
    try {
        const [result] = await db.query(
            `UPDATE parcels SET parcel_category_id = ?, _name = ?, parcel_description = ?, parcel_unit_price = ?, parcel_weight = ?, parcel_length = ?, parcel_width = ?, parcel_height =?, is_fragile = ?, is_perishable = ?, is_hazardous = ?, is_oversized = ?, is_returnable = ?, is_temperature_sensitive = ? WHERE parcel_id = ?`,
            [parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, parcel_id]
        );
        if (result.affectedRows > 0) {
            console.log('Parcel details updated.');
        } else {
            console.log('No parcel found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating parcel:', error);
    }
};

 // remove / delete parcel record -- case where data is archived and package is delivered
 async function removeParcel (parcel_id) { 
    try {
        // Check if the parcel exists in the inventory and get its quantity and warehouse location
        const [inventory] = await db.query(`
            SELECT warehouse_location_id, quantity FROM parcel_inventories 
            WHERE parcel_id = ?;
        `, [parcel_id]);

        if (Array.isArray(inventory) && inventory.length > 0) {
            // Calculate the total quantity of the parcel across all inventories
            const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);

            // If the parcel still has stock, prevent the deletion
            if (totalQuantity > 0) {
                console.log(`Cannot remove parcel. Quantity in inventory is ${totalQuantity}.`);
                return false;  // Indicate that the parcel cannot be removed
            }

            // If no stock, remove associated parcel_inventories using the removeParcelWarehouseLocation function
            for (const item of inventory) {
                const { warehouse_location_id } = item;
                const result = await parcima.removeParcelWarehouseLocation(warehouse_location_id);

                if (!result) {
                    console.log(`Failed to remove warehouse location with ID ${warehouse_location_id}`);
                    return false;
                }
            }

            console.log(`Successfully removed all parcel inventories for parcel ID: ${parcel_id}`);
        } else {
            console.log(`Parcel not found in inventory. Proceeding to delete.`);
        }

        // Now, remove the parcel from the parcels table
        const [result] = await db.query(`
            DELETE FROM parcels 
            WHERE parcel_id = ?;
        `, [parcel_id]);

        if (result.affectedRows > 0) {
            console.log('Parcel successfully deleted.');
            return true;  
        } else {
            console.log('No parcel found with the given ID.');
            return false;  
        }
    } catch (error) {
        console.error('Error removing parcel:', error);
        return false;  
    }
};

const token_manager = { getParcels, viewParcel, addParcel, updateParcel, removeParcel };
export default token_manager;