import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import logger from '../utils/logUtil.js';
import archiver from '../utils/archiveUtil.js';

// add new location for item
async function addWarehouseLocation(warehouse_id, section, aisle, rack, shelf, bin) {
    try {
        const newID = await idGen.generateID('warehouse_locations', 'warehouse_location_id', 'WLO');
        console.log(newID);
        const [result] = await db.query(
            `INSERT INTO warehouse_locations (warehouse_location_id, warehouse_id, section, aisle, rack, shelf, bin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [newID, warehouse_id, section, aisle, rack, shelf, bin]
        );
        console.log('New warehouse location added:', newID);
        return newID;
    } catch (error) {
        console.error('Error adding warehouse location:', error);
        return null;
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

async function removeWarehouseLocation(warehouse_location_id) {
    try {
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

// WAREHOUSE ENTITY FUNCTIONS

// get warehouses
async function getWarehouses () {
    try {
        const [rows] = await db.query(`
            SELECT 
                w.warehouse_id, 
                w.warehouse_address, 
                w.capacity AS total_capacity,
                wt.warehouse_type_name,
                COALESCE(SUM(
                    CASE WHEN pi.product_id IS NOT NULL THEN 
                        pi.quantity * (p.product_length * p.product_width * p.product_height) 
                    ELSE 0 END
                    +
                    CASE WHEN pari.parcel_id IS NOT NULL THEN 
                        pari.quantity * (par.parcel_length * par.parcel_width * par.parcel_height)
                    ELSE 0 END
                ), 0) AS current_capacity_used
            FROM 
                warehouses w
            LEFT JOIN warehouse_types wt ON w.warehouse_type_id = wt.warehouse_type_id
            LEFT JOIN product_inventories pi ON w.warehouse_id = pi.warehouse_id
            LEFT JOIN products p ON pi.product_id = p.product_id
            LEFT JOIN parcel_inventories pari ON w.warehouse_id = pari.warehouse_id
            LEFT JOIN parcels par ON pari.parcel_id = par.parcel_id
            GROUP BY 
                w.warehouse_id, 
                w.warehouse_address, 
                w.capacity, 
                wt.warehouse_type_name;
    `);
        return rows;
    } catch (error) {
        console.error('Error retrieving warehouses:', error); 
        return [];
    } 
};

// view warehouse details
async function viewWarehouse (warehouse_id) {
    try {
        const [rows] = await db.query(`
            SELECT 
                w.warehouse_id, 
                w.warehouse_address, 
                w.capacity AS total_capacity,
                wt.warehouse_type_name,
                COALESCE(SUM(
                    CASE WHEN pi.product_id IS NOT NULL THEN 
                        pi.quantity * (p.product_length * p.product_width * p.product_height) 
                    ELSE 0 END
                    +
                    CASE WHEN pari.parcel_id IS NOT NULL THEN 
                        pari.quantity * (par.parcel_length * par.parcel_width * par.parcel_height)
                    ELSE 0 END
                ), 0) AS current_capacity_used
            FROM 
                warehouses w
            LEFT JOIN warehouse_types wt ON w.warehouse_type_id = wt.warehouse_type_id
            LEFT JOIN product_inventories pi ON w.warehouse_id = pi.warehouse_id
            LEFT JOIN products p ON pi.product_id = p.product_id
            LEFT JOIN parcel_inventories pari ON w.warehouse_id = pari.warehouse_id
            LEFT JOIN parcels par ON pari.parcel_id = par.parcel_id
            WHERE 
                w.warehouse_id = ?
            GROUP BY 
                w.warehouse_id, 
                w.warehouse_address, 
                w.capacity, 
                wt.warehouse_type_name;
    `[warehouse_id]);
        return rows;
    } catch (error) {
        console.error('Error retrieving warehouses:', error); 
        return [];
    } 
};

// is warehouse empty
async function isEmpty(warehouse_id) {
    console.log(`Checking if warehouse ${warehouse_id} is empty.`);
    
    try {
        const query = `
            SELECT 
                (
                    CASE 
                        WHEN COALESCE(SUM(
                            CASE WHEN pi.product_id IS NOT NULL THEN 
                                pi.quantity * (p.product_length * p.product_width * p.product_height)
                            ELSE 0 END
                            +
                            CASE WHEN pari.parcel_id IS NOT NULL THEN 
                                pari.quantity * (par.parcel_length * par.parcel_width * par.parcel_height)
                            ELSE 0 END
                        ), 0) = 0 
                        THEN TRUE 
                        ELSE FALSE 
                    END
                ) AS isEmpty
            FROM warehouses w
            LEFT JOIN product_inventories pi ON w.warehouse_id = pi.warehouse_id
            LEFT JOIN products p ON pi.product_id = p.product_id
            LEFT JOIN parcel_inventories pari ON w.warehouse_id = pari.warehouse_id
            LEFT JOIN parcels par ON pari.parcel_id = par.parcel_id
            WHERE w.warehouse_id = ? 
            GROUP BY w.warehouse_id;
        `;

        const [result] = await db.query(query, [warehouse_id]);

        // Log the result to debug
        console.log('Result from isEmpty query:', result);

        if (result.length > 0) {
            const isEmpty = result[0].isEmpty;
            console.log(`Warehouse ${warehouse_id} empty status: ${isEmpty}`);  // Log the empty status
            return isEmpty;
        } else {
            console.log(`No warehouse found with ID ${warehouse_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error checking if warehouse is empty:', error);
        return false;
    }
}

// is warehouse full
async function isFull(warehouse_id) {
    try {
        const query = `
            SELECT 
                w.capacity AS total_capacity,
                COALESCE(SUM(
                    -- Calculate the volume of products
                    CASE WHEN pi.product_id IS NOT NULL THEN 
                        pi.quantity * (p.product_length * p.product_width * p.product_height)
                    ELSE 0 END
                    +
                    -- Calculate the volume of parcels
                    CASE WHEN pari.parcel_id IS NOT NULL THEN 
                        pari.quantity * (par.parcel_length * par.parcel_width * par.parcel_height)
                    ELSE 0 END
                ), 0) AS current_capacity_used
            FROM warehouses w
            LEFT JOIN product_inventories pi ON w.warehouse_id = pi.warehouse_id
            LEFT JOIN products p ON pi.product_id = p.product_id
            LEFT JOIN parcel_inventories pari ON w.warehouse_id = pari.warehouse_id
            LEFT JOIN parcels par ON pari.parcel_id = par.parcel_id
            WHERE w.warehouse_id = ? 
            GROUP BY w.warehouse_id;
        `;
        
        const [result] = await db.query(query, [warehouse_id]);

        if (result.length === 0) {
            console.log(`No warehouse found with ID: ${warehouse_id}`);
            return false;
        }

        const totalCapacity = result[0].total_capacity;
        const currentCapacityUsed = result[0].current_capacity_used;

        // Check if the warehouse is full
        return currentCapacityUsed >= totalCapacity;
    } catch (error) {
        console.error('Error checking if warehouse is full:', error);
        return false;
    }
};


// add warehouse
async function addWarehouse (warehouse_address, warehouse_capacity, warehouse_type_id) {
    try {
        const newID = await idGen.generateID('warehouses', 'warehouse_id', 'WHR');
        const [result] = await db.query(
            "INSERT INTO warehouses (warehouse_id, warehouse_address, capacity, warehouse_type_id) VALUES (?, ?, ?, ?)",
            [newID, warehouse_address, warehouse_capacity, warehouse_type_id]
        );
        if (result.affectedRows > 0) {
            console.log('Warehouse added with ID:', newID);
            const log_message = `Warehouse added with ID ${newID}`;
            logger.addWarehouseLog(newID, log_message);
            return true;
        } else {
            console.log('Error adding warehouse.');
            return false;
        }
    } catch (error) {
        console.error('Error adding warehouse:', error);
        return false;
    }
};

// update warehouse capacity
async function updateWarehouseCapacity(warehouse_id, new_capacity) {
    console.log(new_capacity);
    try {
        const [result] = await db.query (`
            UPDATE warehouses
            SET capacity = ?
            WHERE warehouse_id = ?
            `, [new_capacity, warehouse_id]   
        );
        if (result.affectedRows > 0) {
            console.log(`Warehouse ${warehouse_id} capacity updated to ${new_capacity}`);
            const log_message = `Warehouse ${warehouse_id} capacity updated to ${new_capacity}`;
            logger.addWarehouseLog(warehouse_id, log_message);
            return true;
        } else {
            console.log(`No warehouse with ID: ${warehouse_id} found.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating warehouse capacity:', error);
        return false;
    }
};

// remove warehouse
async function removeWarehouse(warehouse_id) {
    try {
        console.log(`Initiating removal process for warehouse ${warehouse_id}`);
        
        const isEmptyResult = await isEmpty(warehouse_id);  // Capture return value
        console.log(`isEmpty result for warehouse ${warehouse_id}:`, isEmptyResult, `Type: ${typeof isEmptyResult}`);
        
        if (isEmptyResult === 1) {
            console.log(`Warehouse ${warehouse_id} is empty. Proceeding with archiving.`);
            
            const archiveResult = await archiver.archiveWarehouse(warehouse_id);
            console.log(`Archiving warehouse result for ${warehouse_id}:`, archiveResult);
            
            if (archiveResult) {
                console.log(`Warehouse ${warehouse_id} archived successfully.`);
                
                const [result] = await db.query("DELETE FROM warehouses WHERE warehouse_id = ?", [warehouse_id]);
                console.log(`Delete result for warehouse ${warehouse_id}:`, result);
                
                if (result.affectedRows > 0) {
                    console.log(`Warehouse ${warehouse_id} deleted successfully.`);
                    const log_message = `Warehouse with ID ${warehouse_id} removed.`;
                    await logger.addWarehouseLog(warehouse_id, log_message);
                    return true;
                } else {
                    console.error(`No warehouse found with ID ${warehouse_id}.`);
                    return false;
                }
            } else {
                console.error(`Error archiving warehouse with ID ${warehouse_id}.`);
                return false;
            }
        } else if (isEmptyResult === false) {
            console.log(`Warehouse ${warehouse_id} is not empty. Cannot delete.`);
            return false;
        } else {
            console.error(`Unexpected isEmpty result for warehouse ${warehouse_id}:`, isEmptyResult);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting warehouse ${warehouse_id}:`, error);
        return false;
    }
}



async function getWarehouseById(warehouse_id) {
    try {
        const [rows] = await db.query(`
            SELECT 
                w.warehouse_id, 
                w.warehouse_address, 
                w.capacity AS total_capacity,
                wt.warehouse_type_name,
                COALESCE(SUM(
                    CASE WHEN pi.product_id IS NOT NULL THEN 
                        pi.quantity * (p.product_length * p.product_width * p.product_height) 
                    ELSE 0 END
                    +
                    CASE WHEN pari.parcel_id IS NOT NULL THEN 
                        pari.quantity * (par.parcel_length * par.parcel_width * par.parcel_height)
                    ELSE 0 END
                ), 0) AS current_capacity_used
            FROM 
                warehouses w
            LEFT JOIN warehouse_types wt ON w.warehouse_type_id = wt.warehouse_type_id
            LEFT JOIN product_inventories pi ON w.warehouse_id = pi.warehouse_id
            LEFT JOIN products p ON pi.product_id = p.product_id
            LEFT JOIN parcel_inventories pari ON w.warehouse_id = pari.warehouse_id
            LEFT JOIN parcels par ON pari.parcel_id = par.parcel_id
            WHERE 
                w.warehouse_id = ?
            GROUP BY 
                w.warehouse_id, 
                w.warehouse_address, 
                w.capacity, 
                wt.warehouse_type_name;
        `, [warehouse_id]);

        return rows.length > 0 ? rows[0] : null; // Return the first row or null if no rows found
    } catch (error) {
        console.error('Error retrieving warehouse by ID:', error); 
        return null; // Return null in case of error
    } 
}

async function getWarehouseLocationId(warehouse_id) {
    console.log("passed:",warehouse_id);
    try {
        const [rows] = await db.query(`
            SELECT warehouse_location_id
            FROM warehouse_locations
            WHERE warehouse_id = ?
        `, [warehouse_id]);

        if (rows.length > 0) {
            console.log(rows[0].warehouse_location_id);
            return rows[0].warehouse_location_id; // Return the first matching warehouse location ID
        } else {
            console.log('No warehouse location found with the given details.');
            return null; // Return null if no match is found
        }
    } catch (error) {
        console.error('Error retrieving warehouse location ID:', error);
        return null; // Return null in case of error
    }
};

export default {
    addWarehouseLocation,
    updateWarehouseLocation,
    removeWarehouseLocation,
    getWarehouses,
    viewWarehouse,
    isEmpty,
    isFull,
    addWarehouse,
    removeWarehouse,
    updateWarehouseCapacity,
    getWarehouseById,
    getWarehouseLocationId
};