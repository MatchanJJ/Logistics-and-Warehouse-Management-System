import pool from '../test_main/DBconnection/DBConnection.js'; // Ensure the database connection is correctly imported

const warehouseManagementToken = {
    // LIST ALL WAREHOUSE
    async listAllWarehouse() {
        try {
            const [result] = await pool.query("SELECT * FROM warehouses");
            return result; // Return the result
        } catch (error) {
            console.error('Error listing warehouses:', error);
            throw error; // Rethrow to handle in the calling function
        }
    },

    // ADD WAREHOUSE
    async addWarehouse(id, location, capacity, warehouse_type_id) {
        try {
            const [result] = await pool.query(
                "INSERT INTO warehouses (warehouse_id, warehouse_address, capacity, warehouse_type_id) VALUES (?, ?, ?, ?)",
                [id, location, capacity, warehouse_type_id]
            );
            console.log('Warehouse added with ID:', result.insertId);
        } catch (error) {
            console.error('Error adding warehouse:', error);
            throw error; // Rethrow to handle in the calling function
        }
    },

    // UPDATE WAREHOUSE DETAILS (location, capacity, warehouse type)
    async updateWarehouseDetails(id, location, capacity, warehouse_type_id) {
        try {
            const [result] = await pool.query(
                "UPDATE warehouses SET warehouse_address = ?, capacity = ?, warehouse_type_id = ? WHERE warehouse_id = ?",
                [location, capacity, warehouse_type_id, id]
            );
            if (result.affectedRows > 0) {
                console.log('Warehouse details updated.');
            } else {
                console.log('No warehouse found with the given ID.');
            }
        } catch (error) {
            console.error('Error updating warehouse details:', error);
            throw error; // Rethrow to handle in the calling function
        }
    },

    // CHECK AVAILABLE CAPACITY
    async checkAvailableCapacity(id) {
        try {
            const [rows] = await pool.query(
                "SELECT capacity FROM warehouses WHERE warehouse_id = ?",
                [id]
            );
            return rows; // Return the queried rows
        } catch (error) {
            console.error('Error checking available capacity:', error);
            throw error; // Rethrow to handle in the calling function
        }
    },

    // VIEW WAREHOUSE DETAILS BY ID
    async findWarehouseById(id) {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM warehouses WHERE warehouse_id = ?",
                [id]
            );
            return rows.length > 0 ? rows[0] : null; // Return the warehouse details or null if not found
        } catch (error) {
            console.error('Error fetching warehouse details:', error);
            throw error;
        }
    },

    // CHECK IF WAREHOUSE IS AVAILABLE (NOT FULL AND NOT EMPTY)
    async checkWarehouseAvailability(id) {
        const MAX_CAPACITY = 1000;  // Set the max capacity of the warehouse
    
        try {
            const [rows] = await pool.query(
                "SELECT capacity FROM warehouses WHERE warehouse_id = ?",
                [id]
            );
    
            if (rows.length === 0) {
                throw new Error(`Warehouse with ID ${id} not found`);
            }
    
            const { capacity } = rows[0];
    
            // Check if the warehouse is empty (capacity == 0)
            if (capacity === 0) {
                return true; // Warehouse is empty, not available for more packages
            }
    
            // Check if the warehouse is full (capacity >= MAX_CAPACITY)
            if (capacity >= MAX_CAPACITY) {
                return false; // Warehouse is full, not available
            }
    
            // If neither full nor empty, the warehouse is available
            return true; // Warehouse is available
        } catch (error) {
            console.error('Error checking warehouse availability:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    }
    
};

export default warehouseManagementToken; // Export the token for use in other files
