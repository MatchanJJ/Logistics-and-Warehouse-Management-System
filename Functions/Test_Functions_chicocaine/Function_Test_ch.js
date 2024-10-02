//import exp from "constants";
import pool from "./../DBConnection.js"
import express from 'express';
import path from 'path';  // Import the path module
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory (adjust the path as necessary)
app.set('views', path.join(__dirname, '../views')); 
app.set('view engine', 'ejs');

// Token Manager
const token_manager = {
    helloWorld,
    getTables,
    getInventory,
    getOrders,
    getCustomers,
    getEmployees
}
// Temporary Test Functions

function helloWorld () {
    return "Hello World";
}

async function getTables () {
    try {
        const [result] = await pool.query (
            "SHOW TABLES;"
        );
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getCustomers () {
    try {
        const [rows] = await pool.query (
            "SELECT * FROM customers;"
        );
        return rows;
    } catch (error) {
        console.error(error);
    }
}
async function getEmployees () {
    try {
        const [rows] = await pool.query (
            `SELECT
                e.employee_id AS employee_id,
                CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS employee_name,  
                e.contact_info AS contact_info,
                er.role_name AS role,
                e.employee_salary AS salary 
            FROM employees e
            JOIN employee_roles er ON e.employee_role_id = er.employee_role_id;`
        );
        return rows;
    } catch (error) {
        console.error(error);
    }
}

async function getOrders () {
    try {
        const [rows] = await pool.query (
            `(
            SELECT
                o.order_id AS order_id,
                CONCAT(c.customer_first_name, ' ', c.customer_last_name) AS customer_name,
                os.order_status_name AS order_status,
                s.shipping_service_name AS shipping_service,
                o.shipping_address AS shipping_address, 
                o.shipping_receiver AS shipping_receiver,
                ot.order_type_name AS order_type,
                po.product_quantity AS quantity,
                po.product_unit_price AS unit_price,
                'product' AS item_type,
                o.order_total_amount AS total_amount,
                GROUP_CONCAT(p.product_name SEPARATOR ', ') AS order_items,
                SUM(po.product_quantity) AS total_quantity,
                pc.product_category_name AS category
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN order_status os ON o.order_status_id = os.order_status_id
            JOIN shipping_services s ON o.shipping_service_id = s.shipping_service_id
            JOIN order_types ot ON o.order_type_id = ot.order_type_id
            JOIN product_orders po ON o.order_id = po.order_id
            JOIN products p ON po.product_id = p.product_id
            JOIN product_categories pc ON p.product_category_id = pc.product_category_id
            GROUP BY o.order_id
        )
        UNION ALL
        (
            SELECT
                o.order_id AS order_id,
                CONCAT(c.customer_first_name, ' ', c.customer_last_name) AS customer_name,
                os.order_status_name AS order_status,
                s.shipping_service_name AS shipping_service,
                o.shipping_address AS shipping_address,
                o.shipping_receiver AS shipping_receiver,
                ot.order_type_name AS order_type,
                1 AS quantity,
                par.parcel_unit_price AS unit_price,
                'parcel' AS item_type,
                o.order_total_amount AS total_amount,
                GROUP_CONCAT(par.parcel_description SEPARATOR ', ') AS order_items,
                1 AS total_quantity,
                parc.parcel_category_name AS category
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN order_status os ON o.order_status_id = os.order_status_id
            JOIN shipping_services s ON o.shipping_service_id = s.shipping_service_id
            JOIN order_types ot ON o.order_type_id = ot.order_type_id
            JOIN postal_orders po ON o.order_id = po.order_id
            JOIN parcels par ON po.parcel_id = par.parcel_id
            JOIN parcel_categories parc ON par.parcel_category_id = parc.parcel_category_id
            GROUP BY o.order_id 
            );`
        );
        //ORDER BY order_id, item_type;
        return rows;
    } catch(error) {
        console.error(error);
    }
}

async function getShipments () {
    try {
        const [rows] = await pool.query (
            ``
        )
    } catch (error) {
        console.error(error);
    }
}

async function getInventory () {
    try {
        const [rows] = await pool.query (
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
}
export default token_manager;