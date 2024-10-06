import pool from "../test_main/DBconnection/DBConnection.js";

// FINDING A SPECIFIC PARCEL
async function findParcel(parcel_id) {                    
    try {
        const [rows] = await pool.query("SELECT * FROM parcels WHERE parcel_id = ?", [parcel_id]);
        return rows[0];  // return the found parcel
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error for calling context handling
    }
}

// REGISTER NEW PARCEL 
async function insertParcel(parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive) {
    try {
        const [result] = await pool.query(
            "INSERT INTO parcels (parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive]
        );
        return result.insertId; // Return the ID of the newly inserted parcel
    } catch (error) {
        console.error('Error inserting parcel:', error);
        throw error; // Rethrow the error for calling context handling
    }
}

// FOR UPDATING A PARCEL
async function updateParcel(parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id) {
    try {
        const [result] = await pool.query(
            "UPDATE parcels SET parcel_category_id = ?, parcel_description = ?, parcel_unit_price = ?, parcel_weight = ?, parcel_length = ?, parcel_width = ?, parcel_height = ?, is_fragile = ?, is_perishable = ?, is_hazardous = ?, is_returnable = ?, is_temperature_sensitive = ? WHERE parcel_id = ?", 
            [parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id]
        );
        return result.affectedRows > 0; // Return true if update was successful
    } catch (error) {
        console.error('Error updating parcel:', error);
        throw error; // Rethrow the error for calling context handling
    }
}

// DELETING A PARCEL
async function deleteParcel(parcel_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM parcels WHERE parcel_id = ?", 
            [parcel_id]
        );
        return result.affectedRows > 0; // Return true if deletion was successful
    } catch (error) {
        console.error('Error deleting parcel:', error);
        throw error; // Rethrow the error for calling context handling
    }
}

// LISTING ALL PARCELS
async function listAllParcel() {
    try {
        const [rows] = await pool.query("SELECT * FROM parcels");
        //console.log('All Products:', rows);
        return rows; // Return the list of products
    } catch (error) {
        console.error('Error listing parcels:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

// Exporting the parcel management functions
const parcelManagementToken = {
    findParcel,
    insertParcel,
    updateParcel,
    deleteParcel,
    listAllParcel
};

export default parcelManagementToken;
