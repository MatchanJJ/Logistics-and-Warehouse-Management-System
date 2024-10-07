import db from '../DBconnection/DBConnection.js';
import idGen from './idGenerator.js';

// Add a log entry to the customer_logs table
async function addCustomerLog(customer_id, log_description) {
    try {
        const newID = await idGen.generateID('customer_logs', 'customer_log_id', 'CSL');
        const [result] = await db.query(`
            INSERT INTO customer_logs (customer_log_id, customer_id, customer_log_description)
            VALUES (?, ?, ?);
        `, [newID, customer_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding employee log:', error);
        return false;
    }
};

// get most recent customer change time
async function returnRecentTimeCustomer (customer_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM customer_logs WHERE customer_id = ? ORDER BY date_time DESC LIMIT 1',
            [customer_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given customer_id: ${customer_id}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
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
// get most recent employee change time
async function returnRecentTimeEmployee (employee_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM employee_logs WHERE employee_id = ? ORDER BY date_time DESC LIMIT 1',
            [employee_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given employee: ${employee_id}`);
            return null; 
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
    }
};

// Add a log entry to the order_logs table
async function addOrderLog(order_id, log_description) {
    try {
        const newID = await idGen.generateID('order_logs', 'order_log_id', 'ORL');
        const [result] = await db.query(`
            INSERT INTO order_logs (order_log_id, order_id, order_log_description)
            VALUES (?, ?, ?);
        `, [newID, order_id, log_description]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding order log:', error);
        return false;
    }
};
// get most recent order change time
async function returnRecentTimeOrder (order_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM order_logs WHERE order_id = ? ORDER BY date_time DESC LIMIT 1',
            [order_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given order: ${order_id}`);
            return null; 
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
    }
};

// Add a log entry to the parcel_inventory_logs table
async function addParcelInventoryLog(parcel_id, warehouse_id, log_description) {
    try {
        const newID = await idGen.generateID('parcel_inventory_logs', 'parcel_inventory_log_id', 'PIL');
        const [result] = await db.query(`
            INSERT INTO parcel_inventory_logs (parcel_inventory_log_id, parcel_id, warehouse_id, parcel_inventory_log_description)
            VALUES (?, ?, ?, ?);
        `, [newID, parcel_id, warehouse_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding parcel inventory log:', error);
        return false;
    }
};
// get most recent parcel change time
async function returnRecentTimeParcel (parcel_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM parcel_inventory_logs WHERE parcel_id = ? ORDER BY date_time DESC LIMIT 1',
            [parcel_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given parcel: ${parcel_id}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
    }
};

// Add a log entry to the product_inventory_logs table
async function addProductInventoryLog(product_id, warehouse_id, log_description) {
    try {
        const newID = await idGen.generateID('product_inventory_logs', 'product_inventory_log_id', 'PIL');
        const [result] = await db.query(`
            INSERT INTO product_inventory_logs (product_inventory_log_id, product_id, warehouse_id, product_inventory_log_description)
            VALUES (?, ?, ?, ?);
        `, [newID, product_id, warehouse_id, log_description]);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding product inventory log:', error);
        return false;
    }
};

// get most recent product change time
async function returnRecentTimeProduct (product_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM product_inventory_logs WHERE product_id = ? ORDER BY date_time DESC LIMIT 1',
            [product_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given product: ${product_id}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
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
// get most recent return change time
async function returnRecentTimeReturn (return_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM return_logs WHERE return_id = ? ORDER BY date_time DESC LIMIT 1',
            [return_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given return: ${return_id}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
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

// get most recent shipment change time
async function returnRecentTimeShipment (shipment_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM shipment_logs WHERE shipment_id = ? ORDER BY date_time DESC LIMIT 1',
            [shipment_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given shipment: ${shipment_id}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
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
// get most recent warehouse change time
async function returnRecentTimeWarehouse (warehouse_id) {
    try {
        const result = await db.query(
            'SELECT date_time FROM warehouse_logs WHERE warehouse_id = ? ORDER BY date_time DESC LIMIT 1',
            [warehouse_id]
        );
        if (result.rows.length > 0) {
            return result.rows[0].date_time;
        } else {
            console.log(`No entries found for the given warehouse: ${warehouse_id}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching recent time:', error);
        return null;
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
    addWarehouseLog,
    returnRecentTimeCustomer,
    returnRecentTimeEmployee,
    returnRecentTimeOrder,
    returnRecentTimeParcel,
    returnRecentTimeProduct,
    returnRecentTimeReturn,
    returnRecentTimeShipment,
    returnRecentTimeWarehouse
};