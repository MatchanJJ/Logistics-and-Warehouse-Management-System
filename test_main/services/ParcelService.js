import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import archiver from '../utils/archiveUtil.js';
import logger from '../utils/logUtil.js';
import inServ from './InventoryService.js';

// get all parcel record list
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
        return [];
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
                p.is_temperature_sensitive,
                pc.parcel_category_name AS category_name
            FROM parcels p
            JOIN parcel_categories pc ON p.parcel_category_id = pc.parcel_category_id
            WHERE p.parcel_id = ?;
        `, [parcel_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error finding parcel:', error);
        return null;
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
        if (result.affectedRows > 0) {
            console.log('Parcel inserted with ID:', newID);
            const log_message = `Parcel record added to database.`;
            logger.addParcelInventoryLog(newID, null, log_message);
            return true;
        } else {
            console.log('Error adding new parcel record.');
            return false;
        }
    } catch (error) {
        console.error('Error inserting parcel:', error);
    }
};

// update parcel details
async function updateParcel(parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, parcel_id) {
    try {
        const [result] = await db.query(
            `UPDATE parcels SET parcel_category_id = ?, parcel_description = ?, parcel_unit_price = ?, parcel_weight = ?, parcel_length = ?, parcel_width = ?, parcel_height =?, is_fragile = ?, is_perishable = ?, is_hazardous = ?, is_oversized = ?, is_returnable = ?, is_temperature_sensitive = ? WHERE parcel_id = ?`,
            [parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, parcel_id]
        );
        if (result.affectedRows > 0) {
            console.log('Parcel details updated.');
            const log_message = `Parcel ${parcel_id} details updated.`;
            logger.addParcelInventoryLog(parcel_id, null, log_message);
            return true;
        } else {
            console.log('No parcel found with the given ID.');
            return false;
        }
    } catch (error) {
        console.error('Error updating parcel:', error);
        return false;
    }
};

// remove parcel detail record
async function removeParcel(parcel_id) { 
    try {
        // Check if the parcel exists in the inventory and get its quantity and warehouse location
        const [inventory] = await db.query(`
            SELECT warehouse_id, warehouse_location_id, quantity 
            FROM parcel_inventories 
            WHERE parcel_id = ?;
        `, [parcel_id]);

        if (Array.isArray(inventory) && inventory.length > 0) {
            // total quantity of parcels matching this parcel's record
            const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);

            // If the parcel still has stock, prevent the deletion
            if (totalQuantity > 0) {
                console.log(`Cannot remove parcel. Quantity in inventory is ${totalQuantity}.`);
                return false; 
            }

            // If no stock, remove associated parcel_inventories using the removeParcelWarehouseLocation function
            for (const item of inventory) {
                const { warehouse_id, warehouse_location_id } = item;
                const result = await inServ.removeParcelWarehouseLocation(parcel_id, warehouse_id);

                if (!result) {
                    console.log(`Failed to remove parcel from warehouse location with ID ${warehouse_location_id}`);
                    return false;
                }
            }

            console.log(`Successfully removed all parcel inventories for parcel ID: ${parcel_id}`);
        } else {
            console.log(`Parcel not found in inventory. Proceeding to delete.`);
        }
        // archive and remove the parcel record
        if (await archiver.archiveParcel(parcel_id)) {
            const [result] = await db.query(`
                DELETE FROM parcels 
                WHERE parcel_id = ?;
            `, [parcel_id]);

            if (result.affectedRows > 0) {
                console.log('Parcel successfully deleted.');
                const log_message = `Parcel ${parcel_id} record removed.`;
                logger.addParcelInventoryLog(parcel_id, null, log_message);
                return true;  
            } else {
                console.log('No parcel found with the given ID.');
                return false;  
            }
        } else {
            console.error('Error archiving and deleting parcel: ', error);
            return false;
        }
    } catch (error) {
        console.error('Error removing parcel:', error);
        return false;  
    }
};

const ParcelServiceToken = {
    getParcels,
    viewParcel,
    addParcel,
    updateParcel,
    removeParcel
};

export default ParcelServiceToken;