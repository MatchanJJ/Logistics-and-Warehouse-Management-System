import db from '../DBconnection/DBConnection.js';

// get shipment archives
async function getShipmentArchives () {
    try {
        const [result] = await db.query('SELECT * FROM shipment_archives ORDER BY archived_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting shipment_archive:', error);
        return [];
    }
};

// get parcel archives
async function getParcelArchives () {
    try {
        const [result] = await db.query('SELECT * FROM parcel_archives ORDER BY archived_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting parcel_archive:', error);
        return [];
    }
};

// get product archives
async function getProductArchives () {
    try {
        const [result] = await db.query('SELECT * FROM product_archives ORDER BY archived_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting product_archive:', error);
        return [];
    }
};

// get order archives
async function getOrderArchives () {
    try {
        const [result] = await db.query('SELECT * FROM order_archives ORDER BY archived_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting order_archive:', error);
        return [];
    }
};

// get employee archives
async function getEmployeeArchives () {
    try {
        const [result] = await db.query('SELECT * FROM employee_archives ORDER BY archived_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting employee_archive:', error);
        return [];
    }
};

// get customer archives
async function getCustomerArchives () {
    try {
        const [result] = await db.query('SELECT * FROM customer_archives ORDER BY archived_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting customer_archive:', error);
        return [];
    }
};

// get warehouse archives
async function getWarehouseArchives () {
    try {
        const [result] = await db.query('SELECT * FROM warehouse_archives ORDER BY archived_at DESC');
        return result;
    } catch (error) {
        console.error('Error getting warehouse_archive:', error);
        return [];
    }
};



export default {
    getCustomerArchives,
    getEmployeeArchives,
    getOrderArchives,
    getParcelArchives,
    getProductArchives,
    getShipmentArchives,
    getWarehouseArchives
};