import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import logger from '../utils/logUtil.js';
import archiver from '../utils/archiveUtil.js';

// Get all shipments
async function getShipments() {
    try {
        const [rows] = await db.query(`
            SELECT
                s.shipment_id,
                o.order_id,
                c.carrier_id,
                s.current_location,
                s.shipping_address,
                s.shipment_date,
                s.estimated_delivery_date,
                ss.shipping_service_name AS shipping_service,
                st.shipment_status_name AS shipment_status
            FROM shipments s
            JOIN shipping_services ss ON s.shipping_service_id = ss.shipping_service_id
            JOIN orders o ON s.order_id = o.order_id
            JOIN shipment_status st ON s.shipment_status_id = st.shipment_status_id
            LEFT JOIN carriers c ON s.carrier_id = c.carrier_id;
        `);
        return rows;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        return [];
    }
};

// Get specific shipment details / track shipment
async function getShipmentDetails(shipment_id) {
    try {
        const [rows] = await db.query(`
            SELECT
                s.shipment_id,
                o.order_id,
                c.carrier_id,
                s.current_location,
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
};

// Add a new shipment for an order
async function addShipment(order_id, carrier_id, shipping_service_id, shipping_address, estimated_delivery_date) {
    try {
        const shipment_status_id = 'SS001'; //change depending on the populate id convention
        const newID = await idGen.generateID('shipments', 'shipment_id', 'SHI');
        const [result] = await db.query(`
            INSERT INTO shipments (shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, estimated_delivery_date, shipment_status_id)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [newID, order_id, carrier_id, shipping_service_id, shipping_address, estimated_delivery_date, shipment_status_id]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${newID} added successfully.`);
            const log_message = `Shipment ${newID} added successfully.`;
            logger.addShipmentLog(newID, log_message);
            return true;
        } else {
            console.log('Failed to add shipment.');
            return false;
        }
    } catch (error) {
        console.error('Error adding shipment:', error);
        return false;
    }
};

// Update shipment status
async function updateShipmentStatus(shipment_id, new_shipment_status_id) {
    try {
        const [result] = await db.query(`
            UPDATE shipments SET shipment_status_id = ? WHERE shipment_id = ?;
        `, [new_shipment_status_id, shipment_id]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${shipment_id} status updated to ${new_shipment_status_id}.`);
            const log_message = `Shipment ${shipment_id} status updated to ${new_shipment_status_id}.`;
            logger.addShipmentLog(shipment_id, log_message);
            return true;
        } else {
            console.log(`Shipment ${shipment_id} not found.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating shipment status:', error);
        return false;
    }
};

// update shipment current_location
async function updateShipmentCurrentLocation(shipment_id, new_current_location) {
    try {
        const [result] = await db.query(`
            UPDATE shipments SET current_location = ? WHERE shipment_id = ?;
        `, [new_current_location, shipment_id]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${shipment_id} location updated to ${new_current_location}.`);
            const log_message = `Shipment ${shipment_id} location updated to ${new_current_location}.`;
            logger.addShipmentLog(shipment_id, log_message);
            return true;
        } else {
            console.log(`Shipment ${shipment_id} not found.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating shipment current location:', error);
        return false;
    }
};

// Remove shipment
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

        // Only allow deletion if shipment is failed or returned
        if (shipment_status_id === 'SST0000004' || shipment_status_id === 'SST0000005') {
            if (await archiver.archiveShipment(shipment_id)) {
                const [result] = await db.query(`
                    DELETE FROM shipments WHERE shipment_id = ?;
                `, [shipment_id]);
        
                if (result.affectedRows > 0) {
                    console.log(`Shipment ${shipment_id} removed successfully.`);
                    const log_message = `Shipment ${shipment_id} removed and archived.`;
                    logger.addShipmentLog(shipment_id, log_message);
                    return true;
                } else {
                    console.log(`Failed to remove shipment ${shipment_id}.`);
                    return false;
                }
            } else {
                console.log('Error archiving shipment.');
                return false;
            }
        } else {
            console.log('Cannot remove a shipment that is in transit or delivered.');
            return false;
        }
    } catch (error) {
        console.error('Error removing shipment:', error);
        return false;
    }
};

export default {
    getShipments,
    getShipmentDetails,
    addShipment,
    updateShipmentStatus,
    updateShipmentCurrentLocation,
    removeShipment
};