import db from '../DBconnection/DBConnection.js';
import idGen from './idGenerator.js';

// Add a log entry to the customer_logs table
async function addCustomerLog(customer_id, log_description) {
    try {
        const newID = await idGen.generateID('customer_logs', 'customer_log_id', 'CSL');
        const [result] = await db.query(`
            INSERT INTO customer_logs (employee_log_id, employee_id, employee_log_description)
            VALUES (?, ?, ?);
        `, [newID, employee_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding employee log:', error);
        return false;
    }
};

// Add a log entry to the employee_logs table
async function addEmployeeLog(employee_id, log_description) {
    try {
        const newID = await idGen.generateID('employee_logs', 'employee_log_id', 'EML');
        const [result] = await db.query(`
            INSERT INTO employee_logs (employee_log_id, employee_id, employee_log_description)
            VALUES (?, ?, ?);
        `, [newID, employee_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding employee log:', error);
        return false;
    }
};

// Add a log entry to the order_logs table
async function addOrderLog(order_id, order_status_id, log_description) {
    try {
        const newID = await idGen.generateID('order_logs', 'order_log_id', 'ORDL');
        const [result] = await db.query(`
            INSERT INTO order_logs (order_log_id, order_id, order_status_id, order_log_description)
            VALUES (?, ?, ?, ?);
        `, [newID, order_id, order_status_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding order log:', error);
        return false;
    }
};

// Add a log entry to the parcel_inventory_logs table
async function addParcelInventoryLog(parcel_inventory_id, warehouse_id, log_description) {
    try {
        const newID = await idGen.generateID('parcel_inventory_logs', 'parcel_inventory_log_id', 'PIL');
        const [result] = await db.query(`
            INSERT INTO parcel_inventory_logs (parcel_inventory_log_id, parcel_inventory_id, warehouse_id, parcel_inventory_log_description)
            VALUES (?, ?, ?, ?);
        `, [newID, parcel_inventory_id, warehouse_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding parcel inventory log:', error);
        return false;
    }
};

// Add a log entry to the product_inventory_logs table
async function addProductInventoryLog(product_inventory_id, warehouse_id, log_description) {
    try {
        const newID = await idGen.generateID('product_inventory_logs', 'product_inventory_log_id', 'PIL');
        const [result] = await db.query(`
            INSERT INTO product_inventory_logs (product_inventory_log_id, product_inventory_id, warehouse_id, product_inventory_log_description)
            VALUES (?, ?, ?, ?);
        `, [newID, product_inventory_id, warehouse_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding product inventory log:', error);
        return false;
    }
};

// Add a log entry to the return_logs table
async function addReturnLog(return_id, log_description) {
    try {
        const newID = await idGen.generateID('return_logs', 'return_log_id', 'RL');
        const [result] = await db.query(`
            INSERT INTO return_logs (return_log_id, return_id, return_log_description)
            VALUES (?, ?, ?);
        `, [newID, return_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding return log:', error);
        return false;
    }
};

// Add a log entry to the shipment_logs table
async function addShipmentLog(shipment_id, log_description) {
    try {
        const newID = await idGen.generateID('shipment_logs', 'shipment_log_id', 'SHL');
        const [result] = await db.query(`
            INSERT INTO shipment_logs (shipment_log_id, shipment_id, shipment_log_description)
            VALUES (?, ?, ?);
        `, [newID, shipment_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding shipment log:', error);
        return false;
    }
};

// Add a log entry to the warehouse_logs table
async function addWarehouseLog(warehouse_id, log_description) {
    try {
        const newID = await idGen.generateID('warehouse_logs', 'warehouse_log_id', 'WL');
        const [result] = await db.query(`
            INSERT INTO warehouse_logs (warehouse_log_id, warehouse_id, warehouse_log_description)
            VALUES (?, ?, ?);
        `, [newID, warehouse_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding warehouse log:', error);
        return false;
    }
};

export default {
    addCustomerLog,
    addEmployeeLog,
    addOrderLog,
    addParcelInventoryLog,
    addProductInventoryLog,
    addReturnLog,
    addShipmentLog,
    addWarehouseLog
};