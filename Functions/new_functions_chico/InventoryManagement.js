import db from '../DBConnection.js';

async function getInventory () {
    try {
        const [rows] = await db.query (
            `SELECT 
                pi.product_inventory_id AS inventory_id,
                'Product' AS inventory_type,
                w.warehouse_address AS warehouse,
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
            FROM product_inventories pi
            JOIN products p ON pi.product_id = p.product_id
            JOIN warehouses w ON pi.warehouse_id = w.warehouse_id
            JOIN warehouse_locations wl ON pi.warehouse_location_id = wl.warehouse_location_id

            UNION ALL

            SELECT 
                pari.parcel_inventory_id AS inventory_id,
                'Parcel' AS inventory_type,
                w.warehouse_address AS warehouse,
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
            FROM parcel_inventories pari
            JOIN parcels par ON pari.parcel_id = par.parcel_id
            JOIN warehouses w ON pari.warehouse_id = w.warehouse_id
            JOIN warehouse_locations wl ON pari.warehouse_location_id = wl.warehouse_location_id;
            `
        );
        return rows;
    } catch (error) {
        console.error(error);
    }
};

export default { getInventory };