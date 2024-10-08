import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';

// get all carriers
async function getCarriers () {
    try {
        const [result] = await db.query(
            `SELECT
                car.carrier_id AS carrier_id,
                car.carrier_name AS carrier,  
                shs.shipping_service_name AS shipping_service,
                car.carrier_contact_info AS contact_info
            FROM carriers car
            JOIN shipping_services shs ON car.shipping_service_id = shs.shipping_service_id;
            `
        );
        return result;
    } catch (error) {
        console.error(error);
        return []
    }
};

// add new carrier
async function addCarrier(carrier_name, shipping_service_id, carrier_contact_info) {
    try {
        const newID = await idGen.generateID('carriers', 'carrier_id', 'CAR');
        console.log(newID);
        const [result] = await db.query(
            "INSERT INTO carriers (carrier_id, carrier_name, shipping_service_id, carrier_contact_info) VALUES (?, ?, ?, ?)", 
            [newID, carrier_name, shipping_service_id, carrier_contact_info]
        );
        if (result.affectedRows > 0) {
            console.log('Added new carrier:', newID);
            return true;
        } else {
            console.log('Failed to add new carrier.');
            return false;
        }
    } catch (error) {
        console.error('Failed to add carrier:', error);
        return false;
    }
};

// update carrier details
async function updateCarrier(carrier_name, shipping_service_id, carrier_contact_info, carrier_id) {
    try {
        const [result] = await db.query(
            `UPDATE carriers SET carrier_name = ?, shipping_service_id = ?, carrier_contact_info = ? WHERE carrier_id = ?`, 
            [carrier_name, shipping_service_id, carrier_contact_info, carrier_id]
        );
        if (result.affectedRows > 0) {
            console.log("Updated carrier data at carrier_id: ", carrier_id);
            return true;
        } else {
            console.log("Carrier_id does not exist or some other error");
            return false;
        }
    } catch (error) {
        console.error('Error updating carrier:', error);
        return false;
    }
};

// remove carrier
async function removeCarrier(carrier_id) {
    try {
        const [shipments] = await db.query(
            "SELECT shipment_id FROM shipments WHERE carrier_id = ?",
            [carrier_id]
        );
        if (shipments.length > 0) {
            console.log('Carrier cannot be removed. They are assigned to one or more shipments.');
        } else {
            const [result] = await db.query(
                "DELETE FROM carriers WHERE carrier_id = ?",
                [carrier_id]
            );
            if (result.affectedRows > 0) {
                console.log('Carrier successfully deleted.');
                return true;
            } else {
                console.log('No carrier found with the given ID.');
                return false;
            }
        }
    } catch (error) {
        console.error('Error deleting carrier:', error);
        return false
    }
};

export default {
    getCarriers,
    addCarrier,
    updateCarrier,
    removeCarrier
};