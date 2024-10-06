import pool from "../test_main/DBconnection/DBConnection.js";

const shipmentManagementToken = {
    addShipment,
    trackShipment,
    listAllShipment,
    findShipmentById,
    updateShipment,      // Added function to update a shipment
    deleteShipment,      // Added function to delete a shipment
};

// DATABASE FUNCTIONS

// ADD SHIPMENT
async function addShipment(shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) {
    try {
        const [result] = await pool.query(
            "INSERT INTO shipments (shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id]
        );
        console.log('Shipment added with ID:', result.insertId);
    } catch (error) {
        console.error("Error adding shipment:", error);
    }
}

// TRACK SHIPMENT
async function trackShipment(shipment_status_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM shipments WHERE shipment_status_id = ?", [shipment_status_id]);
        return rows;
    } catch (error) {
        console.error("Error tracking shipment:", error);
    }
}

// LIST ALL SHIPMENTS
async function listAllShipment() {
    try {
        const [rows] = await pool.query("SELECT * FROM shipments");
        return rows;
    } catch (error) {
        console.error("Error listing shipments:", error);
    }
}

// FIND SHIPMENT BY ID
async function findShipmentById(shipment_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM shipments WHERE shipment_id = ?", [shipment_id]);
        return rows.length > 0 ? rows[0] : null; // Return the shipment if found, else null
    } catch (error) {
        console.error("Error finding shipment by ID:", error);
    }
}

// UPDATE SHIPMENT
async function updateShipment(shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) {
    try {
        const [result] = await pool.query(
            "UPDATE shipments SET order_id = ?, carrier_id = ?, shipping_service_id = ?, shipping_address = ?, shipment_date = ?, estimated_delivery_date = ?, shipment_status_id = ? WHERE shipment_id = ?",
            [order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id, shipment_id]
        );
        return result.affectedRows > 0; // Return true if the shipment was updated
    } catch (error) {
        console.error("Error updating shipment:", error);
        return false; // Return false if an error occurred
    }
}

// DELETE SHIPMENT
async function deleteShipment(shipment_id) {
    try {
        const [result] = await pool.query("DELETE FROM shipments WHERE shipment_id = ?", [shipment_id]);
        return result.affectedRows > 0; // Return true if the shipment was deleted
    } catch (error) {
        console.error("Error deleting shipment:", error);
        return false; // Return false if an error occurred
    }
}

export default shipmentManagementToken;
