import pool from "./test_main/DBconnection/DBConnection.js";

// ADDING NEW EMPLOYEE
async function addEmployee(employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) {
    try {
        const [result] = await pool.query(
            "INSERT INTO employees (employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) VALUES (?, ?, ?, ?, ?, ?)", 
            [employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary]
        );
        return result.insertId; // Return the ID of the newly inserted employee
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// ASSIGN JOB ROLE
async function assignJobRole(employee_role_id, employee_id) {
    try {
        const [result] = await pool.query(
            "UPDATE employees SET employee_role_id = ? WHERE employee_id = ?", 
            [employee_role_id, employee_id]
        );
        return result.affectedRows > 0; // Return true if assignment was successful
    } catch (error) {
        console.error('Error assigning job role:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// UPDATING EMPLOYEE DETAILS
async function updateEmployee(employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id) {
    try {
        const [result] = await pool.query(
            "UPDATE employees SET employee_first_name = ?, employee_last_name = ?, contact_info = ?, employee_role_id = ?, employee_salary = ? WHERE employee_id = ?", 
            [employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id]
        );
        return result.affectedRows > 0; // Return true if update was successful
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

//VIEW ALL EMPLOYEE
async function viewEmployee(employeeId) {
    try {
        const [rows] = await pool.query("SELECT * FROM employees WHERE employee_id = ?", [employeeId]);
        return rows.length ? rows[0] : null; // Return the employee if found, otherwise null
    } catch (error) {
        console.error('Error getting employee by ID:', error);
        throw error; // Rethrow to handle in the route
    }
}


// REMOVING AN EMPLOYEE
async function deleteEmployee(employee_id) {
    try {
        const [result] = await pool.query("DELETE FROM employees WHERE employee_id = ?", [employee_id]);
        return result.affectedRows > 0; // Return true if deletion was successful
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// ADD JOB ROLE
async function addJobRole(employee_role_id, role_name) {
    try {
        const [result] = await pool.query(
            "INSERT INTO employee_roles (employee_role_id, role_name) VALUES (?, ?)", 
            [employee_role_id, role_name]
        );
        return result.insertId; // Return the ID of the newly inserted job role
    } catch (error) {
        console.error('Error adding job role:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// REMOVING JOB ROLE
async function removeJobRole(employee_role_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM employee_roles WHERE employee_role_id = ?", 
            [employee_role_id]
        );
        return result.affectedRows > 0; // Return true if removal was successful
    } catch (error) {
        console.error('Error removing job role:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// LISTING ALL EMPLOYEES
async function listAllEmployees() {
    try {
        const [rows] = await pool.query("SELECT * FROM employees");
        return rows; // Return all employees
    } catch (error) {
        console.error('Error listing employees:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}
// LISTING ALL JOB ROLES
async function listAllJobRoles() {
    try {
        const [rows] = await pool.query("SELECT * FROM employee_roles");
        return rows; // Return all job roles
    } catch (error) {
        console.error('Error listing job roles:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// VIEW A SPECIFIC JOB ROLE BY ID
async function viewJobRole(employee_role_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM employee_roles WHERE employee_role_id = ?", [employee_role_id]);
        return rows.length ? rows[0] : null; // Return the job role if found, otherwise null
    } catch (error) {
        console.error('Error fetching job role:', error);
        throw error; // Rethrow to handle in the route
    }
}

// UPDATE JOB ROLE
async function updateJobRole(employee_role_id, role_name) {
    try {
        const [result] = await pool.query(
            "UPDATE employee_roles SET role_name = ? WHERE employee_role_id = ?",
            [role_name, employee_role_id]
        );
        return result.affectedRows > 0; // Return true if update was successful
    } catch (error) {
        console.error('Error updating job role:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// Exporting the employee management functions
const employeeManagementToken = {
    addEmployee,
    assignJobRole,
    updateEmployee,
    viewEmployee,
    deleteEmployee,
    addJobRole,
    removeJobRole,
    listAllEmployees,
    listAllJobRoles,     
    viewJobRole,         
    updateJobRole
};

export default employeeManagementToken;
