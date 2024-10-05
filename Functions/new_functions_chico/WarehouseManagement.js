import db from '../DBConnection.js';
import idGen from './idGenerator.js';


// Get warehouses
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
        console.log(rows);
        return rows;
    } catch (error) {
        console.error(error); 
        return [];
    } 
};

async function isEmpty(warehouse_id) {
    try {
        const query = `
            SELECT 
                (
                    CASE 
                        WHEN COALESCE(SUM(
                            -- Calculate the volume of products
                            CASE WHEN pi.product_id IS NOT NULL THEN 
                                pi.quantity * (p.product_length * p.product_width * p.product_height)
                            ELSE 0 END
                            +
                            -- Calculate the volume of parcels
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
        return result[0].isEmpty;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// add warehouse
async function addWarehouse (warehouse_address, warehouse_capacity, warehouse_type_id) {
    try {
        const newID = await idGen.generateID('warehouses', 'warehouse_id', 'WHR');
        console.log(newID);
        const [result] = await db.query(
            "INSERT INTO warehouses (warehouse_id, warehouse_address, capacity, warehouse_type_id) VALUES (?, ?, ?, ?)",
            [newID, warehouse_address, warehouse_capacity, warehouse_type_id]
        );
        console.log('Warehouse added with ID:', newID);
    } catch (error) {
        console.error('Error adding warehouse:', error);
    }
};

// remove warehouse
async function removeWarehouse(warehouse_id) {
    try {
        if (await isEmpty(warehouse_id)) {
            const [result] = await pool.query(
                "DELETE FROM warehouses WHERE warehouse_id = ?",
                [warehouse_id]
            );
            if (result.affectedRows > 0) {
                console.log('Warehouse deleted.');
            } else {
                console.log('No warehouse found with the given ID.');
            }
        } else {
            console.log('Warehouse is not empty. Cannot delete.');
        }
    } catch (error) {
        console.error('Error deleting warehouse:', error);
    }
}

export default { getWarehouses, isEmpty, addWarehouse, removeWarehouse };