import db from '../DBConnection.js';
import idGen from './idGenerator.js';

const token_manager = {
    getCustomers,
    viewCustomerInfo,
    addCustomer,
    updateCustomer,
    removeCustomer
};
// Get all customers
async function getCustomers() {
    try {
        const [rows] = await db.query(`
            SELECT
                c.customer_id AS customer_id,
                CONCAT(c.customer_first_name, ' ', customer_last_name) AS customer_name,
                c.customer_email AS email,
                c.customer_address AS address
                FROM customers c;
            `);
        return rows;
    } catch (error) {
        console.error('Error fetching customers:', error);
        return [];
    }
};

// View customer info by customer_id
async function viewCustomerInfo(customer_id) {
    try {
        const [rows] = await db.query('SELECT * FROM customers WHERE customer_id = ?;', [customer_id]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            console.log(`Customer with ID ${customer_id} not found.`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching customer info:', error);
        return null;
    }
};

// Add a new customer
async function addCustomer(customer_first_name, customer_last_name, customer_email, customer_address) {
    try {
        // Generate a new customer_id
        const newID = await idGen.generateID('customers', 'customer_id', 'CUS');
        const [result] = await db.query(`
            INSERT INTO customers (customer_id, customer_first_name, customer_last_name, customer_email, customer_address) 
            VALUES (?, ?, ?, ?, ?);
        `, [newID, customer_first_name, customer_last_name, customer_email, customer_address]);
        if (result.affectedRows > 0) {
            console.log(`Customer added with ID ${newID}.`);
            return newID;
        } else {
            console.log('Failed to add customer.');
            return null;
        }
    } catch (error) {
        console.error('Error adding customer:', error);
        return null;
    }
};

// Update customer info
async function updateCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address) {
    try {
        const [result] = await db.query(`
            UPDATE customers 
            SET customer_first_name = ?, customer_last_name = ?, customer_email = ?, customer_address = ?
            WHERE customer_id = ?;
        `, [customer_first_name, customer_last_name, customer_email, customer_address, customer_id]);

        if (result.affectedRows > 0) {
            console.log(`Customer with ID ${customer_id} successfully updated.`);
            return true;
        } else {
            console.log(`No customer found with ID ${customer_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        return false;
    }
};

// Remove customer (only if they have no orders)
async function removeCustomer(customer_id) {
    try {
        // Check if the customer has any associated orders
        const [orders] = await db.query(`
            SELECT order_id FROM orders WHERE customer_id = ?;
        `, [customer_id]);

        if (orders.length > 0) {
            console.log(`Cannot remove customer with ID ${customer_id}. They have active orders.`);
            return false;
        }

        // If no orders exist, proceed to delete the customer
        const [result] = await db.query(`
            DELETE FROM customers WHERE customer_id = ?;
        `, [customer_id]);

        if (result.affectedRows > 0) {
            console.log(`Customer with ID ${customer_id} successfully removed.`);
            return true;
        } else {
            console.log(`No customer found with ID ${customer_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing customer:', error);
        return false;
    }
};

export default token_manager;