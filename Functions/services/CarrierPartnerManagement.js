import pool from "../DBconnection/DBConnection.js";
const carrierPartnerTokens = {
    addCarrierPartner,
    updateLogisticsPartner,
    viewLogisticsPartner,
    deleteLogisticsPartner,
    listAllLogisticsPartners
}

// ADD NEW PARTNER
async function addCarrierPartner(carrier_id, carrier_name, shipping_service_id, carrier_contact_info) {
    try {
        const [result] = await pool.query(
            "INSERT INTO carriers (carrier_id, carrier_name, shipping_service_id, carrier_contact_info) VALUES (?, ?, ?, ?)", 
            [carrier_id, carrier_name, shipping_service_id, carrier_contact_info]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// UPDATING LOGISTIC PARTNER
async function updateLogisticsPartner(carrier_name, shipping_service_id, carrier_contact_info, carrier_id) {
    try {
        const [result] = await pool.query(
            "UPDATE carriers SET carrier_name = ?, shipping_service_id = ?, carrier_contact_info = ? WHERE carrier_id = ?", 
            [carrier_name, shipping_service_id, carrier_contact_info, carrier_id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// VIEWING A PARTNER
async function viewLogisticsPartner(carrier_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM carriers WHERE carrier_id = ?", [carrier_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching logistics partner:', error);
        throw error;
    }
}


// REMOVE A PARTNER
async function deleteLogisticsPartner(carrier_id) {
    try {
        const [result] = await pool.query("DELETE FROM carriers WHERE carrier_id = ?", [carrier_id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// LIST ALL PARTNERS
async function listAllLogisticsPartners() {
    try {
        const [rows] = await pool.query("SELECT * FROM carriers");
        return rows;
    } catch (error) {
        throw error;
    }
}

export default carrierPartnerTokens;