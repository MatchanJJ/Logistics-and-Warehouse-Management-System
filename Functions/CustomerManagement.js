import pool from '../test_main/DBconnection/DBConnection.js';

// Function to create a new customer
async function createCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address) {
    try {
        const [result] = await pool.query(
            "INSERT INTO customers (customer_id, customer_first_name, customer_last_name, customer_email, customer_address) VALUES (?, ?, ?, ?, ?)",
            [customer_id, customer_first_name, customer_last_name, customer_email, customer_address]
        );
        return result.insertId; // Return the ID of the new customer
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error; // Propagate error for handling in routes
    }
}

// Function to update an existing customer
async function updateCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address) {
    try {
        const [result] = await pool.query(
            "UPDATE customers SET customer_first_name = ?, customer_last_name = ?, customer_email = ?, customer_address = ? WHERE customer_id = ?",
            [customer_first_name, customer_last_name, customer_email, customer_address, customer_id]
        );
        return result.affectedRows > 0; // Return true if the update was successful
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error; // Propagate error for handling in routes
    }
}

// Function to delete a customer
async function deleteCustomer(customerId) {
    try {
        // Delete related orders first
        await pool.query("DELETE FROM orders WHERE customer_id = ?", [customerId]);
        
        // Now delete the customer
        const [result] = await pool.query("DELETE FROM customers WHERE customer_id = ?", [customerId]);
        return result.affectedRows > 0; // Return true if deletion was successful
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}


// Function to view all customers
async function listAllCustomers() {
    try {
        const [rows] = await pool.query("SELECT * FROM customers");
        return rows; // Return the list of customers
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error; // Propagate error for handling in routes
    }
}

// Function to find a specific customer by ID
async function findCustomerById(customer_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM customers WHERE customer_id = ?", [customer_id]);
        return rows.length ? rows[0] : null; // Return the found customer or null if not found
    } catch (error) {
        console.error('Error getting customer by ID:', error);
        throw error; // Rethrow to handle in the route
    }
}


// Exporting the customer management functions
const customerManagementToken = {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    listAllCustomers,
    findCustomerById
};

export default customerManagementToken;
