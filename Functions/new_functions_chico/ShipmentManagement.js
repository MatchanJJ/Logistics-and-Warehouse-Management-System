import db from '../dbConnection/DBConnection.js';
import idGen from './idGenerator.js';

// Get all shipments
async function getShipments() {
    try {
        const [rows] = await db.query(`
            SELECT
                s.shipment_id,
                o.order_id,
                c.carrier_id,
                s.shipping_address,
                s.shipment_date,
                s.estimated_delivery_date,
                ss.shipping_service_name AS shipping_service,
                st.shipment_status_name AS shipment_status
            FROM shipments s
            JOIN shipping_services ss ON s.shipping_service_id = ss.shipping_service_id
            JOIN orders o ON s.order_id = o.order_id
            JOIN shipment_statuses st ON s.shipment_status_id = st.shipment_status_id
            LEFT JOIN carriers c ON s.carrier_id = c.carrier_id;
        `);
        return rows;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        return [];
    }
}

// Get specific shipment details
async function getShipmentDetails(shipment_id) {
    try {
        const [rows] = await db.query(`
            SELECT
                s.shipment_id,
                o.order_id,
                c.carrier_id,
                s.shipping_address,
                s.shipment_date,
                s.estimated_delivery_date,
                ss.shipping_service_name AS shipping_service,
                st.shipment_status_name AS shipment_status
            FROM shipments s
            JOIN shipping_services ss ON s.shipping_service_id = ss.shipping_service_id
            JOIN orders o ON s.order_id = o.order_id
            JOIN shipment_statuses st ON s.shipment_status_id = st.shipment_status_id
            LEFT JOIN carriers c ON s.carrier_id = c.carrier_id
            WHERE s.shipment_id = ?;
        `, [shipment_id]);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error(`Error fetching shipment ${shipment_id}:`, error);
        return null;
    }
}

// Add a new shipment
async function addShipment(order_id, carrier_id, shipping_service_id, shipping_address, estimated_delivery_date, shipment_status_id) {
    try {
        const newID = await idGen.generateID('shipments', 'shipment_id', 'SHI');
        const [result] = await db.query(`
            INSERT INTO shipments (shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, estimated_delivery_date, shipment_status_id)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [newID, order_id, carrier_id, shipping_service_id, shipping_address, estimated_delivery_date, shipment_status_id]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${newID} added successfully.`);
            return newID;
        } else {
            console.log('Failed to add shipment.');
            return null;
        }
    } catch (error) {
        console.error('Error adding shipment:', error);
        return null;
    }
}

// Update shipment status
async function updateShipmentStatus(shipment_id, new_shipment_status_id) {
    try {
        const [result] = await db.query(`
            UPDATE shipments SET shipment_status_id = ? WHERE shipment_id = ?;
        `, [new_shipment_status_id, shipment_id]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${shipment_id} status updated to ${new_shipment_status_id}.`);
            return true;
        } else {
            console.log(`Shipment ${shipment_id} not found.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating shipment status:', error);
        return false;
    }
}

// Remove shipment -- only if status is not "in transit" or "delivered"
async function removeShipment(shipment_id) {
    try {
        // Check the shipment status
        const [rows] = await db.query(`
            SELECT shipment_status_id FROM shipments WHERE shipment_id = ?;
        `, [shipment_id]);

        if (rows.length === 0) {
            console.log('Shipment not found.');
            return false;
        }

        const { shipment_status_id } = rows[0];

        // Only allow deletion if the status is not "in transit" or "delivered"
        if (shipment_status_id === 'in transit' || shipment_status_id === 'delivered') {
            console.log('Cannot remove a shipment that is in transit or delivered.');
            return false;
        }

        const [result] = await db.query(`
            DELETE FROM shipments WHERE shipment_id = ?;
        `, [shipment_id]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${shipment_id} removed successfully.`);
            return true;
        } else {
            console.log(`Failed to remove shipment ${shipment_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing shipment:', error);
        return false;
    }
}

// Track a shipment by tracking number (using shipment_id or tracking number if present)
async function trackShipment(shipment_id) {
    try {
        const [rows] = await db.query(`
            SELECT
                s.shipment_id,
                o.order_id,
                s.shipping_address,
                s.shipment_date,
                s.estimated_delivery_date,
                ss.shipping_service_name AS shipping_service,
                st.shipment_status_name AS shipment_status,
                c.carrier_id
            FROM shipments s
            JOIN shipping_services ss ON s.shipping_service_id = ss.shipping_service_id
            JOIN orders o ON s.order_id = o.order_id
            JOIN shipment_statuses st ON s.shipment_status_id = st.shipment_status_id
            LEFT JOIN carriers c ON s.carrier_id = c.carrier_id
            WHERE s.shipment_id = ?;
        `, [shipment_id]);

        if (rows.length > 0) {
            console.log(`Shipment details for shipment ID ${shipment_id}:`, rows[0]);
            return rows[0];
        } else {
            console.log(`No shipment found with ID: ${shipment_id}`);
            return null;
        }
    } catch (error) {
        console.error('Error tracking shipment:', error);
        return null;
    }
}

export default {
    getShipments,
    getShipmentDetails,
    addShipment,
    updateShipmentStatus,
    removeShipment,
    trackShipment
};