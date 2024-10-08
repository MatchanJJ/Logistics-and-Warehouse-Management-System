import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import logger from '../utils/logUtil.js';
import archiver from '../utils/archiveUtil.js';

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
        return rows;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
};

// view employee data
async function viewEmployee(employee_id) {
    try {
        const [rows] = await db.query(
            `SELECT
                e.employee_id AS employee_id,
                e.employee_first_name,
                e.employee_last_name,  
                e.contact_info AS contact_info,
                er.role_name AS role,
                e.employee_salary AS salary 
            FROM employees e
            JOIN employee_roles er ON e.employee_role_id = er.employee_role_id 
            WHERE e.employee_id = ?;`, 
            [employee_id]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            console.log(`Employee with ID ${employee_id} not found.`);
            return [];
        }
    } catch (error) {
        console.error('Error retrieving employee:', error);
        return [];
    }
};

// get employee data
async function getEmployeeData(employeeId) {
    try {
        const [rows] = await db.query("SELECT * FROM employees WHERE employee_id = ?", [employeeId]);
        return rows.length ? rows[0] : null; // Return the employee if found, otherwise null
    } catch (error) {
        console.error('Error getting employee by ID:', error);
        throw error; // Rethrow to handle in the route
    }
};

// add Employees 
async function addEmployee (employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) {
    try {
        const newID = await idGen.generateID('employees', 'employee_id', 'EMP');
        const [result] = await db.query(
            `INSERT INTO employees (employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) VALUES (?, ?, ?, ?, ?, ?);`, 
            [newID, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary]
        );
        if (result.affectedRows > 0) {
            console.log(`Employee added with ID ${newID}.`);
            const log_message = `Added new employee.`;
            await logger.addEmployeeLog(newID, log_message);
            return true;
        } else {
            console.log('Failed to add customer.');
            return false;
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        return false;
    }
};

// assign job role / update employee job
async function assignJobRole (employee_role_id, employee_id) {
    try {
        const [result] = await db.query(
            `UPDATE employees SET employee_role_id = ? WHERE employee_id = ?`, 
            [employee_role_id, employee_id]
        );
        if (result.affectedRows > 0) {
            console.log(`Employee with ID ${employee_id} assigned to role with ID ${employee_role_id}.`);
            const log_message = `Assigned new role to employee with role_id ${employee_role_id}.`;
            await logger.addEmployeeLog(employee_id, log_message);
            return true;
        } else {
            console.log('Failed to assign job to employee.');
            return false;
        }
    } catch (error) {
        console.error('Error assigning job to employee:', error);
        return false;
    }
};

// update employee details
async function updateEmployee (employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id) {
    const newID = await idGen.generateID('employee', 'emloyee_id', 'EMP');

    try {
        const [result] = await db.query(
            `UPDATE employees SET employee_first_name = ?, employee_last_name = ?, contact_info = ?, employee_role_id = ?,employee_salary = ? WHERE employee_id = ?`, 
            [employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id]
        );
        if (result.affectedRows > 0) {
            console.log(`Employee details updated with ID ${employee_id}.`);
            const log_message = `Updated employee data.`;
            await logger.addEmployeeLog(newID, log_message);
            return true;
        } else {
            console.log('Failed to assign job to employee.');
            return false;
        }
    } catch (error) {
        console.error('Error updating employee details:', error);
        return false;
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
        // If employee is not assigned to any warehouse, proceed to archive and delete the employee data
        if (await archiver.archiveEmployee(employee_id)) {
            const [result] = await db.query(`
                DELETE FROM employees WHERE employee_id = ?;
            `, [employee_id]);
            if (result.affectedRows > 0) {
                console.log(`Employee ${employee_id} successfully removed.`);
                const log_message = "Removed employee data."
                await logger.addEmployeeLog(employee_id)
                return true; 
            } else {
                console.log(`No employee found with ID ${employee_id}.`);
                return false;
            }
        } else {
            console.log("Error archiving and removing employee data.")
            return false;
        }
    } catch (error) {
        console.error('Error removing employee:', error);
        return false; 
    }
};

// assign employee to warehouse
async function assignEmployeeToWarehouse(warehouse_id, employee_id) {
    
    try {
        // Check if the employee is already assigned to a warehouse
        const [rows] = await db.query(`
            SELECT warehouse_id AS assigned_warehouse
            FROM warehouse_employees 
            WHERE employee_id = ?;
        `, [employee_id]);

        if (rows.length > 0) {
            const { assigned_warehouse } = rows[0];
            console.log(`Cannot assign employee to ${warehouse_id} because employee ${employee_id} is already assigned to warehouse ${assigned_warehouse}`);
            return false;
        }

        // Assign the employee to the new warehouse
        const [result] = await db.query(`
            INSERT INTO warehouse_employees (warehouse_id, employee_id) 
            VALUES (?, ?);
        `, [warehouse_id, employee_id]);

        if (result.affectedRows > 0) {
            console.log(`Employee ${employee_id} assigned to warehouse ${warehouse_id} successfully.`);
            
            // Log the assignment action
            const log_message = `Assigned employee to warehouse with warehouse ID ${warehouse_id}`;
            await logger.addEmployeeLog(employee_id, log_message); // Assuming logger.addEmployeeLog is an async function
            
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
            const log_message = `Transferred employee from warehouse:${current_warehouse_id} to warehouse:${new_warehouse_id}.`;
            await logger.addEmployeeLog(employee_id, log_message);
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
            const log_message = `Unassigned employee from warehouse:${warehouse_id}`;
            await logger.addEmployeeLog(employee_id, log_message);
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

// list all job roles
async function listAllJobRoles() {
    try {
        const [rows] = await db.query("SELECT * FROM employee_roles");
        return rows; 
    } catch (error) {
        console.error('Error listing job roles:', error);
        return [];
    }
};

// view job role
async function viewJobRole(employee_role_id) {
    try {
        const [rows] = await db.query("SELECT * FROM employee_roles WHERE employee_role_id = ?", [employee_role_id]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching job role:', error);
        return [];
    }
};

// add job role
async function addJobRole(employee_role_id, role_name) {
    try {
        const [result] = await db.query(
            "INSERT INTO employee_roles (employee_role_id, role_name) VALUES (?, ?)", 
            [employee_role_id, role_name]
        );
        return result.insertId; 
    } catch (error) {
        console.error('Error adding job role:', error);
        return null;
    }
};

// update job role
async function updateJobRole(employee_role_id, role_name) {
    try {
        const [result] = await db.query(
            "UPDATE employee_roles SET role_name = ? WHERE employee_role_id = ?",
            [role_name, employee_role_id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating job role:', error);
        return false;
    }
};

// remove job role
async function removeJobRole(employee_role_id) {
    try {
        const [result] = await db.query(
            "DELETE FROM employee_roles WHERE employee_role_id = ?", 
            [employee_role_id]
        );
        return result.affectedRows > 0; // Return true if removal was successful
    } catch (error) {
        console.error('Error removing job role:', error);
        return false;
    }
};

export default {
    getEmployees,
    viewEmployee,
    getEmployeeData,
    addEmployee,
    assignJobRole,
    updateEmployee,
    removeEmployee,
    assignEmployeeToWarehouse,
    updateEmployeeWarehouse,
    removeEmployeeFromWarehouse,
    listAllJobRoles,
    addJobRole,
    viewJobRole,
    updateJobRole,
    removeJobRole
};