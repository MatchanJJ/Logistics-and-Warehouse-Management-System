import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import logger from '../utils/logUtil.js';
import archiver from '../utils/archiveUtil.js';
import OrderService from './OrderService.js';
import ReturnService from './ReturnService.js';

// get all shipments
async function getShipments() {
    try {
        const [rows] = await db.query(`
            SELECT
                s.shipment_id,
                o.order_id,
                c.carrier_id,
                s.current_location,
                o.delivery_address,
                s.shipment_date,
                s.estimated_delivery_date,
                ss.shipping_service_name AS shipping_service,
                st.shipment_status_name AS shipment_status
            FROM shipments s
            JOIN orders o ON s.order_id = o.order_id
            LEFT JOIN shipping_services ss ON s.shipping_service_id = ss.shipping_service_id
            LEFT JOIN shipment_status st ON s.shipment_status_id = st.shipment_status_id
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
                o.delivery_address,
                s.shipment_date,
                s.estimated_delivery_date,
                ss.shipping_service_name AS shipping_service,
                st.shipment_status_name AS shipment_status
            FROM shipments s
            JOIN orders o ON s.order_id = o.order_id
            LEFT JOIN shipping_services ss ON s.shipping_service_id = ss.shipping_service_id
            LEFT JOIN shipment_status st ON s.shipment_status_id = st.shipment_status_id
            LEFT JOIN carriers c ON s.carrier_id = c.carrier_id
            WHERE s.shipment_id = ?;
        `, [shipment_id]);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error(`Error fetching shipment ${shipment_id}:`, error);
        return null;
    }
};

// add new shipment for order
async function addShipment(order_id, carrier_id, shipping_service_id) {
    try {
        // Check if the order already has a shipment
        const [existingShipments] = await db.query(`
            SELECT COUNT(*) AS count
            FROM shipments
            WHERE order_id = ? AND carrier_id = ?;
        `, [order_id, carrier_id]);

        if (existingShipments[0].count > 0) {
            console.log('This order already has a shipment.');
            return false;
        }

        const shipment_id = await idGen.generateID('shipments', 'shipment_id', 'SHI');

        const shipment_status_id = 'SST0000001'; // Default is in-transit
        const current_location = 'exiting warehouse';
        const shipment_date = new Date();
        const estimated_delivery_date = new Date();
        estimated_delivery_date.setDate(estimated_delivery_date.getDate() + 7);

        // Insert the new shipment into the database
        const [result] = await db.query(`
            INSERT INTO shipments (
                shipment_id,
                order_id,
                carrier_id,
                shipping_service_id,
                current_location,
                shipment_date,
                estimated_delivery_date,
                shipment_status_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `, [
            shipment_id, order_id, carrier_id, shipping_service_id, current_location, shipment_date, estimated_delivery_date, shipment_status_id
        ]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${shipment_id} added successfully.`);
            const log_message = `Shipment ${shipment_id} added successfully.`;
            await logger.addShipmentLog(shipment_id, log_message);
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

// set shipment status to delivered
async function shipmentDelivered(shipment_id) {
    try {
        // Fetch the order_id associated with the shipment
        const [shipment] = await db.query(`
            SELECT order_id FROM shipments WHERE shipment_id = ?;
        `, [shipment_id]);

        if (shipment.length === 0) {
            console.log(`Shipment ${shipment_id} not found.`);
            return false;
        }

        const order_id = shipment[0].order_id;
        const new_shipment_status_id = 'SST0000002'; // ID for 'delivered' status

        // Update the shipment status
        const [result] = await db.query(`
            UPDATE shipments
            SET shipment_status_id = ?
            WHERE shipment_id = ?;
        `, [new_shipment_status_id, shipment_id]);

        if (result.affectedRows > 0) {
            console.log(`Shipment ${shipment_id} status updated to 'delivered'.`);
            const log_message = `Shipment ${shipment_id} has been delivered.`;
            await logger.addShipmentLog(shipment_id, log_message);

            // Update the order status to 'delivered'
            const orderUpdateSuccess = await OrderService.updateOrderStatus(order_id, 'delivered');
            if (!orderUpdateSuccess) {
                console.error(`Failed to update order ${order_id} status.`);
            }

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

// return shipment
async function returnShipment(shipment_id, return_reason) {
    try {
        const [shipment] = await db.query(`
            SELECT order_id, shipment_status_id FROM shipments WHERE shipment_id = ?;
        `, [shipment_id]);

        if (shipment.length === 0) {
            console.log(`Shipment ${shipment_id} not found.`);
            return false;
        }

        const { order_id, shipment_status_id } = shipment[0];

        // Check if the shipment status is 'delivered'
        if (shipment_status_id !== 'SST0000002') { // Assuming 'SST0000002' is the ID for 'delivered'
            console.log(`Shipment ${shipment_id} is not delivered. Cannot proceed with return.`);
            return false;
        }

        // Update the shipment status to 'returned'
        const new_shipment_status_id = 'SST0000003'; // Assuming 'SST0000003' is the ID for 'returned'
        const [updateResult] = await db.query(`
            UPDATE shipments
            SET shipment_status_id = ?
            WHERE shipment_id = ?;
        `, [new_shipment_status_id, shipment_id]);

        if (updateResult.affectedRows > 0) {
            console.log(`Shipment ${shipment_id} status updated to 'returned'.`);
            const log_message = `Shipment ${shipment_id} has been returned. Reason: ${return_reason}`;
            await logger.addShipmentLog(shipment_id, log_message);

            // Update the order status to 'returned'
            const orderUpdateSuccess = await OrderService.updateOrderStatus(order_id, 'returned');
            if (!orderUpdateSuccess) {
                console.error(`Failed to update order ${order_id} status.`);
            }

            // Log the return action
            const return_date = new Date();
            await ReturnService.addReturn(order_id, return_reason, return_date);

            return true;
        } else {
            console.log(`Failed to update shipment ${shipment_id} status.`);
            return false;
        }
    } catch (error) {
        console.error('Error processing return shipment:', error);
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
            await logger.addShipmentLog(shipment_id, log_message);
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
                    await logger.addShipmentLog(shipment_id, log_message);
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
    shipmentDelivered,
    returnShipment,
    updateShipmentCurrentLocation,
    removeShipment
};