import db from '../DBConnection.js';
import idGen from './new_functions_chico/idGenerator.js';

/* Tables involved:
    - returns
    - shipment_archives
    - parcel_archives
    - product_archives
    - order_archives
    - employee_archives
    - customer_archives
    - warehouse_archives
*/

// Archive a shipment entry
async function archiveShipment(shipment_id) {
    try {
        // Generate new archive ID
        const archiveID = await idGen.generateID('shipment_archives', 'archive_id', 'SHARCH');

        // Insert archived shipment
        const [result] = await db.query(`
            INSERT INTO shipment_archives (archive_id, shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id)
            SELECT ?, shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id
            FROM shipments
            WHERE shipment_id = ?;
        `, [archiveID, shipment_id]);

        // Delete the shipment from the active table
        if (result.affectedRows > 0) {
            await db.query(`DELETE FROM shipments WHERE shipment_id = ?;`, [shipment_id]);
            console.log(`Shipment ${shipment_id} archived successfully.`);
        } else {
            console.log(`Failed to archive shipment ${shipment_id}.`);
        }
    } catch (error) {
        console.error('Error archiving shipment:', error);
    }
}

// Archive a parcel entry
async function archiveParcel(parcel_id) {
    try {
        const archiveID = await idGen.generateID('parcel_archives', 'archive_id', 'PARARCH');

        const [result] = await db.query(`
            INSERT INTO parcel_archives (archive_id, parcel_id, parcel_category_id, parcel_weight, parcel_description)
            SELECT ?, parcel_id, parcel_category_id, parcel_weight, parcel_description
            FROM parcels
            WHERE parcel_id = ?;
        `, [archiveID, parcel_id]);

        if (result.affectedRows > 0) {
            await db.query(`DELETE FROM parcels WHERE parcel_id = ?;`, [parcel_id]);
            console.log(`Parcel ${parcel_id} archived successfully.`);
        } else {
            console.log(`Failed to archive parcel ${parcel_id}.`);
        }
    } catch (error) {
        console.error('Error archiving parcel:', error);
    }
}

// Archive a product entry
async function archiveProduct(product_id) {
    try {
        const archiveID = await idGen.generateID('product_archives', 'archive_id', 'PROARCH');

        const [result] = await db.query(`
            INSERT INTO product_archives (archive_id, product_id, product_name, product_category_id, product_weight, product_length, product_width, product_height, product_supplier, product_unit_price)
            SELECT ?, product_id, product_name, product_category_id, product_weight, product_length, product_width, product_height, product_supplier, product_unit_price
            FROM products
            WHERE product_id = ?;
        `, [archiveID, product_id]);

        if (result.affectedRows > 0) {
            await db.query(`DELETE FROM products WHERE product_id = ?;`, [product_id]);
            console.log(`Product ${product_id} archived successfully.`);
        } else {
            console.log(`Failed to archive product ${product_id}.`);
        }
    } catch (error) {
        console.error('Error archiving product:', error);
    }
}

// Archive an order entry
async function archiveOrder(order_id) {
    try {
        const archiveID = await idGen.generateID('order_archives', 'archive_id', 'ORDARCH');

        const [result] = await db.query(`
            INSERT INTO order_archives (archive_id, order_id, customer_id, order_date_time, order_status_id, shipping_address, shipping_receiver, shipping_service_id, order_total_amount)
            SELECT ?, order_id, customer_id, order_date_time, order_status_id, shipping_address, shipping_receiver, shipping_service_id, order_total_amount
            FROM orders
            WHERE order_id = ?;
        `, [archiveID, order_id]);

        if (result.affectedRows > 0) {
            await db.query(`DELETE FROM orders WHERE order_id = ?;`, [order_id]);
            console.log(`Order ${order_id} archived successfully.`);
        } else {
            console.log(`Failed to archive order ${order_id}.`);
        }
    } catch (error) {
        console.error('Error archiving order:', error);
    }
}

// Archive an employee entry
async function archiveEmployee(employee_id) {
    try {
        const archiveID = await idGen.generateID('employee_archives', 'archive_id', 'EMPARCH');

        const [result] = await db.query(`
            INSERT INTO employee_archives (archive_id, employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary)
            SELECT ?, employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary
            FROM employees
            WHERE employee_id = ?;
        `, [archiveID, employee_id]);

        if (result.affectedRows > 0) {
            await db.query(`DELETE FROM employees WHERE employee_id = ?;`, [employee_id]);
            console.log(`Employee ${employee_id} archived successfully.`);
        } else {
            console.log(`Failed to archive employee ${employee_id}.`);
        }
    } catch (error) {
        console.error('Error archiving employee:', error);
    }
}

// Archive a customer entry
async function archiveCustomer(customer_id) {
    try {
        const archiveID = await idGen.generateID('customer_archives', 'archive_id', 'CUSARCH');

        const [result] = await db.query(`
            INSERT INTO customer_archives (archive_id, customer_id, customer_first_name, customer_last_name, customer_email, customer_address)
            SELECT ?, customer_id, customer_first_name, customer_last_name, customer_email, customer_address
            FROM customers
            WHERE customer_id = ?;
        `, [archiveID, customer_id]);

        if (result.affectedRows > 0) {
            await db.query(`DELETE FROM customers WHERE customer_id = ?;`, [customer_id]);
            console.log(`Customer ${customer_id} archived successfully.`);
        } else {
            console.log(`Failed to archive customer ${customer_id}.`);
        }
    } catch (error) {
        console.error('Error archiving customer:', error);
    }
}

// Archive a warehouse entry
async function archiveWarehouse(warehouse_id) {
    try {
        const archiveID = await idGen.generateID('warehouse_archives', 'archive_id', 'WARARCH');

        const [result] = await db.query(`
            INSERT INTO warehouse_archives (archive_id, warehouse_id, warehouse_address, capacity, warehouse_type_id)
            SELECT ?, warehouse_id, warehouse_address, capacity, warehouse_type_id
            FROM warehouses
            WHERE warehouse_id = ?;
        `, [archiveID, warehouse_id]);

        if (result.affectedRows > 0) {
            await db.query(`DELETE FROM warehouses WHERE warehouse_id = ?;`, [warehouse_id]);
            console.log(`Warehouse ${warehouse_id} archived successfully.`);
        } else {
            console.log(`Failed to archive warehouse ${warehouse_id}.`);
        }
    } catch (error) {
        console.error('Error archiving warehouse:', error);
    }
}

export {
    archiveShipment,
    archiveParcel,
    archiveProduct,
    archiveOrder,
    archiveEmployee,
    archiveCustomer,
    archiveWarehouse
};