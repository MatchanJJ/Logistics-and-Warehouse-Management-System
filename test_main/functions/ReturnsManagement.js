import db from '../DBConnection.js';
import idGen from './idGenerator.js';

// Add a new return
async function addReturn(order_id, return_reason, return_date, return_status_id) {
    try {
        // Generate a new return_id
        const newID = await idGen.generateID('returns', 'return_id', 'RET');

        // Insert the new return entry
        const [result] = await db.query(`
            INSERT INTO returns (return_id, order_id, return_reason, return_date, return_status_id)
            VALUES (?, ?, ?, ?, ?);
        `, [newID, order_id, return_reason, return_date, return_status_id]);

        if (result.affectedRows > 0) {
            console.log(`Return ${newID} added successfully.`);
            return newID;
        } else {
            console.log('Failed to add return.');
            return null;
        }
    } catch (error) {
        console.error('Error adding return:', error);
        return null;
    }
}

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
}

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
            return true;
        } else {
            console.log(`Failed to update status for return ${return_id}.`);
            return false;
        }
    } catch (error) {
        console.error(`Error updating return status for ${return_id}:`, error);
        return false;
    }
}

export { addReturn, viewReturn, updateReturnStatus };
