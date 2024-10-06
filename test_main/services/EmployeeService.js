import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';

// get all Employees
async function getEmployees () {
    try {
        const [rows] = await db.query (
            `SELECT
                e.employee_id AS employee_id,
                CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS employee_name,  
                e.contact_info AS contact_info,
                er.role_name AS role,
                e.employee_salary AS salary 
            FROM employees e
            JOIN employee_roles er ON e.employee_role_id = er.employee_role_id;`
        );
        console.log(rows);
        return rows;
    } catch (error) {
        console.error(error);
    }
};

// get specific employee data
async function viewEmployee(employee_id) {
    try {
        const [rows] = await db.query(
            `SELECT
                e.employee_id AS employee_id,
                CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS employee_name,  
                e.contact_info AS contact_info,
                er.role_name AS role,
                e.employee_salary AS salary 
            FROM employees e
            JOIN employee_roles er ON e.employee_role_id = er.employee_role_id 
            WHERE e.employee_id = ?;`, 
            [employee_id]
        );

        console.log(rows);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error retrieving employee:', error);
        return null;
    }
};

// add Employees 
async function addEmployee (employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) {
    try {
        const newID = await idGen.generateID('employees', 'employee_id', 'EMP');
        console.log(newID);
        const [result] = await db.query(
            `INSERT INTO employees (employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) VALUES (?, ?, ?, ?, ?, ?);`, 
            [newID, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary]
        );
        console.log(result);
        return result.insertId;
    } catch (error) {
        console.error(error);
    }
};

// assign job role / update employee job
async function assignJobRole (employee_role_id, employee_id) {
    try {
        const [result] = await db.query(
            `UPDATE employees SET employee_role_id = ? WHERE employee_id = ?`, 
            [employee_role_id, employee_id]
        );
        console.log(result);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(error);
    }
};

// update employee details
async function updateEmployee (employee_first_name, employee_last_name, contact_info, employee_salary, employee_id) {
    try {
        const [result] = await db.query(
            `UPDATE employees SET employee_first_name = ?, employee_last_name = ?, contact_info = ?, employee_salary = ? WHERE employee_id = ?`, 
            [employee_first_name, employee_last_name, contact_info, employee_salary, employee_id]
        );
        console.log(result);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(error);
    }
};

// fire / remove Employees
async function removeEmployee (employee_id) {
    try {
        // Check if the employee is assigned to any warehouse
        const [assignments] = await db.query(`
            SELECT warehouse_id FROM warehouse_employees WHERE employee_id = ?;
        `, [employee_id]);
        if (assignments.length > 0) {
            console.log(`Cannot remove employee ${employee_id}. They are assigned to a warehouse.`);
            return false; 
        }
        const [result] = await db.query(`
            DELETE FROM employees WHERE employee_id = ?;
        `, [employee_id]);
        if (result.affectedRows > 0) {
            console.log(`Employee ${employee_id} successfully removed.`);
            return true; 
        } else {
            console.log(`No employee found with ID ${employee_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing employee:', error);
        return false; 
    }
};

// Assign employee to a warehouse
async function assignEmployeeToWarehouse(warehouse_id, employee_id) {
    try {
        const [result] = await db.query(`
            INSERT INTO warehouse_employees (warehouse_id, employee_id) 
            VALUES (?, ?);
        `, [warehouse_id, employee_id]);

        if (result.affectedRows > 0) {
            console.log(`Employee ${employee_id} assigned to warehouse ${warehouse_id} successfully.`);
            return true;
        } else {
            console.log('Failed to assign employee to warehouse.');
            return false;
        }
    } catch (error) {
        console.error('Error assigning employee to warehouse:', error);
        return false;
    }
};

// Update employee's assigned warehouse (Transfer employee to another warehouse)
async function updateEmployeeWarehouse(current_warehouse_id, new_warehouse_id, employee_id) {
    try {
        const [result] = await db.query(`
            UPDATE warehouse_employees 
            SET warehouse_id = ? 
            WHERE warehouse_id = ? AND employee_id = ?;
        `, [new_warehouse_id, current_warehouse_id, employee_id]);

        if (result.affectedRows > 0) {
            console.log(`Employee ${employee_id} transferred from warehouse ${current_warehouse_id} to warehouse ${new_warehouse_id}.`);
            return true;
        } else {
            console.log(`Failed to transfer employee ${employee_id} to warehouse ${new_warehouse_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error transferring employee to new warehouse:', error);
        return false;
    }
};

// Remove employee from warehouse
async function removeEmployeeFromWarehouse(warehouse_id, employee_id) {
    try {
        const [result] = await db.query(`
            DELETE FROM warehouse_employees 
            WHERE warehouse_id = ? AND employee_id = ?;
        `, [warehouse_id, employee_id]);

        if (result.affectedRows > 0) {
            console.log(`Employee ${employee_id} removed from warehouse ${warehouse_id}.`);
            return true;
        } else {
            console.log(`Failed to remove employee ${employee_id} from warehouse ${warehouse_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error removing employee from warehouse:', error);
        return false;
    }
};

export default {
    getEmployees,
    viewEmployee,
    addEmployee,
    assignJobRole,
    updateEmployee,
    removeEmployee,
    assignEmployeeToWarehouse,
    updateEmployeeWarehouse,
    removeEmployeeFromWarehouse
};