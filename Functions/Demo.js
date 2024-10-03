import pool from "../DBConnection.js";
import readline from 'readline';

// Function to prompt user for input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to ask a question in the CLI
const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

// CREATE Function
async function createCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address) {
    try {
        const [result] = await pool.query(
            "INSERT INTO customers (customer_id, customer_first_name, customer_last_name, customer_email, customer_address) VALUES (?, ?, ?, ?, ?)", 
            [customer_id, customer_first_name, customer_last_name, customer_email, customer_address]
        );
        console.log('Customer created with ID:', result.insertId);
    } catch (error) {
        console.error('Error creating customer:', error);
    }
}

// UPDATE Function
async function updateCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address) {
    try {
        const [result] = await pool.query(
            "UPDATE customers SET customer_first_name = ?, customer_last_name = ?, customer_email = ?, customer_address = ? WHERE customer_id = ?", 
            [customer_first_name, customer_last_name, customer_email, customer_address, customer_id]
        );
        console.log('Customer updated:', result.affectedRows > 0 ? 'Success' : 'No customer found with the given ID');
    } catch (error) {
        console.error('Error updating customer:', error);
    }
}

// DELETE Function
async function deleteCustomer(customer_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM customers WHERE customer_id = ?", 
            [customer_id]
        );
        console.log('Customer deleted:', result.affectedRows > 0 ? 'Success' : 'No customer found with the given ID');
    } catch (error) {
        console.error('Error deleting customer:', error);
    }
}

// Main function to handle user input and call the corresponding function
(async () => {
    try {
        const action = await askQuestion("What action would you like to perform? (create/update/delete): ");

        if (action === 'create') {
            const customer_id = await askQuestion("Enter Customer ID: ");
            const customer_first_name = await askQuestion("Enter First Name: ");
            const customer_last_name = await askQuestion("Enter Last Name: ");
            const customer_email = await askQuestion("Enter Email: ");
            const customer_address = await askQuestion("Enter Address: ");
            await createCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address);
        } 
        else if (action === 'update') {
            const customer_id = await askQuestion("Enter Customer ID to update: ");
            const customer_first_name = await askQuestion("Enter First Name: ");
            const customer_last_name = await askQuestion("Enter Last Name: ");
            const customer_email = await askQuestion("Enter Email: ");
            const customer_address = await askQuestion("Enter Address: ");
            await updateCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address);
        } 
        else if (action === 'delete') {
            const customer_id = await askQuestion("Enter Customer ID to delete: ");
            await deleteCustomer(customer_id);
        } 
        else {
            console.log('Invalid action. Please choose create, update, or delete.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
        pool.end();  // Close the pool connection after the query is done
    }
})();
