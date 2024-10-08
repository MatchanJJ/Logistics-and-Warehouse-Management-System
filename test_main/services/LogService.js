import db from '../DBconnection/DBConnection.js';

// get all employee logs
async function getEmployeeLogs () {
    try {
        const [result] = await db.query('SELECT * FROM employee_logs ORDER BY date_time DESC');
        return result;
    } catch (error) {
        console.error('Error getting employee_logs:', error);
    }
};

// get all order logs
async function getOrderLogs () {
    try {
        const [result] = await db.query('SELECT * FROM order_logs ORDER BY date_time DESC');
        return result;
    } catch (error) {
        console.error('Error getting order_logs: ', error);
    }
};

// get all parcel logs
async function getParcelInventoryLogs () { 
    try {
        const [result] = await db.query('SELECT * FROM parcel_inventory_logs ORDER BY date_time DESC');
        return result;
    } catch (error) {
        console.error('Error getting parcel_inventory_logs: ', error);
    }
};

// get all product logs
async function getProductInventoryLogs () {
    try {
        const [result] = await db.query('SELECT * FROM product_inventory_logs ORDER BY date_time DESC');
        console.log('Query result:', result); // Log the result for debugging
        return result;
    } catch (error) {
        console.error('Error getting product_inventory_logs: ', error);
    }
};

// get all return logs
async function getReturnLogs () {
    try {
        const [result] = await db.query('SELECT * FROM return_logs ORDER BY date_time DESC');
        return result;
    } catch (error) {
        console.error('Error getting return_logs: ', error);
    }
};

// get all shipment logs
async function getShipmentLogs () {
    try {
        const [result] = await db.query('SELECT * FROM shipment_logs ORDER BY date_time DESC');
        return result;
    } catch (error) {
        console.error('Error getting shipment_logs: ', error);
    }
};

// get all warehouse logs
async function getWarehouseLogs () {
    try {
        const [result] = await db.query('SELECT * FROM warehouse_logs ORDER BY date_time DESC');
        return result;
    } catch (error) {
        console.error('Error getting warehouse_logs: ', error);
    }
};

async function getCustomerLogs () {
    try {
        const [result] = await db.query('SELECT * FROM customer_logs ORDER BY date_time DESC');
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
    getShipmentLogs,
    getWarehouseLogs,
    getCustomerLogs
};