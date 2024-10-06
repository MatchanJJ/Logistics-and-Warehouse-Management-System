import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/logUtil.js';
import logger from '../utils/logUtil.js';
import archiver from '../utils/archiveUtil.js';

// Add a new return
async function addReturn(order_id, return_reason, return_date) {
    try {
        const return_status_id = 'RST0000001';
        // Generate a new return_id
        const newID = await idGen.generateID('returns', 'return_id', 'RET');

        // Insert the new return entry
        const [result] = await db.query(`
            INSERT INTO returns (return_id, order_id, return_reason, return_date, return_status_id)
            VALUES (?, ?, ?, ?, ?);
        `, [newID, order_id, return_reason, return_date, return_status_id]);

        if (result.affectedRows > 0) {
            console.log(`Return ${newID} added successfully.`);
            const log_message = `Return ${newID} added successfully.`;
            logger.addReturnLog(newID, log_message);
            return true;
        } else {
            console.log('Failed to add return.');
            return false;
        }
    } catch (error) {
        console.error('Error adding return:', error);
        return false;
    }
};

// View return by return_id
async function viewReturn(return_id) {
    try {
        const [rows] = await db.query(`
            SELECT return_id, order_id, return_reason, return_date, return_status_id
            FROM returns
            WHERE return_id = ?;
        `, [return_id]);

        if (rows.length > 0) {
            return rows[0];
        } else {
            console.log(`Return ${return_id} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error viewing return ${return_id}:`, error);
        return null;
    }
};

// Update return status by return_id
async function updateReturnStatus(return_id, new_status_id) {
    try {
        const [result] = await db.query(`
            UPDATE returns 
            SET return_status_id = ?
            WHERE return_id = ?;
        `, [new_status_id, return_id]);

        if (result.affectedRows > 0) {
            console.log(`Return ${return_id} status updated to ${new_status_id}.`);
            const log_message = `Return ${return_id} status updated to ${new_status_id}.`;
            logger.addReturnLog(return_id, log_message);
            return true;
        } else {
            console.log(`Failed to update status for return ${return_id}.`);
            return false;
        }
    } catch (error) {
        console.error(`Error updating return status for ${return_id}:`, error);
        return false;
    }
};

export default {
    addReturn,
    viewReturn,
    updateReturnStatus
};