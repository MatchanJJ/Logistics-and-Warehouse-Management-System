import db from '../DBconnection/DBConnection.js';

// get all employee logs
async function getEmployeeLogs () {
    try {
        const [result] = db.query('SELECT * FROM employee_logs');
        return result;
    } catch (error) {
        console.error('Error getting employee_logs:', error);
    }
};

// get all order logs
async function getOrderLogs () {
    try {
        const [result] = db.query('SELECT * FROM order_logs');
        return result;
    } catch (error) {
        console.error('Error getting order_logs: ', error);
    }
};

// get all parcel logs
async function getParcelInventoryLogs () { 
    try {
        const [result] = db.query('SELECT * FROM parcel_inventory_logs');
        return result;
    } catch (error) {
        console.error('Error getting parcel_inventory_logs: ', error);
    }
};

// get all product logs
async function getProductInventoryLogs () {
    try {
        const [result] = db.query('SELECT * FROM product_inventory_logs');
        return result;
    } catch (error) {
        console.error('Error getting product_inventory_logs: ', error);
    }
};

// get all return logs
async function getReturnLogs () {
    try {
        const [result] = db.query('SELECT * FROM return_logs');
        return result;
    } catch (error) {
        console.error('Error getting return_logs: ', error);
    }
};

// get all shipment logs
async function getShipmentLogs () {
    try {
        const [result] = db.query('SELECT * FROM shipment_logs');
        return result;
    } catch (error) {
        console.error('Error getting shipment_logs: ', error);
    }
};

// get all warehouse logs
async function getWarehouseLogs () {
    try {
        const [result] = db.query('SELECT * FROM warehouse_logs');
        return result;
    } catch (error) {
        console.error('Error getting warehouse_logs: ', error);
    }
};

export default {
    getEmployeeLogs,
    getOrderLogs,
    getParcelInventoryLogs,
    getProductInventoryLogs,
    getReturnLogs,
    getShipmentLogs
};