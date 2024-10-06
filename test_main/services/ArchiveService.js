import db from '../DBconnection/DBConnection.js';

// get shipment archives
async function getShipmentArchives () {
    try {
        const [result] = await db.query('SELECT * FROM shipment_archives');
        return result;
    } catch (error) {
        console.error('Error getting shipment_archive:', error);
    }
};

// get parcel archives
async function getParcelArchives () {
    try {
        const [result] = await db.query('SELECT * FROM parcel_archives');
        return result;
    } catch (error) {
        console.error('Error getting parcel_archive:', error);
    }
};

// get product archives
async function getProductArchives () {
    try {
        const [result] = await db.query('SELECT * FROM product_archives');
        return result;
    } catch (error) {
        console.error('Error getting product_archive:', error);
    }
};

// get order archives
async function getOrderArchives () {
    try {
        const [result] = await db.query('SELECT * FROM order_archives');
        return result;
    } catch (error) {
        console.error('Error getting order_archive:', error);
    }
};

// get employee archives
async function getEmployeeArchives () {
    try {
        const [result] = await db.query('SELECT * FROM employee_archives');
        return result;
    } catch (error) {
        console.error('Error getting employee_archive:', error);
    }
};

// get customer archives
async function getCustomerArchives () {
    try {
        const [result] = await db.query('SELECT * FROM customer_archives');
        return result;
    } catch (error) {
        console.error('Error getting customer_archive:', error);
    }
};

// get warehouse archives
async function getWarehouseArchives () {
    try {
        const [result] = await db.query('SELECT * FROM warehouse_archives');
        return result;
    } catch (error) {
        console.error('Error getting warehouse_archive:', error);
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