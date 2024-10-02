import pool from './DBConnection.js'; // Ensure the database connection is correctly imported

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
    }
};

export default warehouseManagementToken; // Export the token for use in other files
