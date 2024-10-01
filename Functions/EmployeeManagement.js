import pool from "./DBConnection.js"
import express from 'express';
import path from 'path';  // Import the path module
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory (adjust the path as necessary)
app.set('views', path.join(__dirname, '../views')); 
app.set('view engine', 'ejs');

// ADDING NEW EMPLOYEE
async function addEmployee(employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) {
    try {
        const [result] = await pool.query(
            "INSERT INTO employees (employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) VALUES (?, ?, ?, ?, ?, ?)", 
            [employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary]
        );
        console.log('Employee added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}
async function assignJobRole(employee_role_id,employee_id) {
    try {
        const [result] =await pool.query(
            "UPDATE employees SET employee_role_id = ? WHERE employee_id = ?",[employee_role_id,employee_id]
        );
    } catch (error) {
        console.error('Error updating roles')
    }
    
}
//UPDATING EMPLOYEE DETAILS
async function updateEmployee(employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id) {
    try {
        const [result] = await pool.query(
            "UPDATE employees SET employee_first_name = ?, employee_last_name = ?, contact_info = ?, employee_role_id = ?, employee_salary = ? WHERE employee_id = ?", 
            [employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id]
        );
        if (result.affectedRows > 0) {
            console.log('Employee details updated.');
        } else {
            console.log('No employee found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating employee details:', error);
    }
}

//VIEWING EMPLOYEE DETAILS
async function viewEmployee(employee_id) {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM employees WHERE id = ?", 
            [employee_id]
        );
        if (rows.length > 0) {
            console.log('Employee details:', rows[0]);
        } else {
            console.log('No employee found with the given ID.');
        }
    } catch (error) {
        console.error('Error fetching employee details:', error);
    }
}

//REMOVING AN EMPLOYEE
async function deleteEmployee(employee_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM employees WHERE id = ?", 
            [employee_id]
        );
        if (result.affectedRows > 0) {
            console.log('Employee deleted.');
        } else {
            console.log('No employee found with the given ID.');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
}

//ADD JOB ROLE
async function addJobRole(employee_role_id, role_name) {
    try {
        consts[result] = await pool.query(
            "INSERT INTO employee_roles (employee_role_id, role_name) VALUES (?, ?)", [employee_role_id, role_name]
        )
    } catch (error) {
        console.error("mali")
    }
}

// REMOVING JOB ROLE
async function removeJobRole(employee_role_id) {
    try {
        consts[result] = await pool.query(
            "DELETE FROM employee_roles WHERE employee_role_id = ? ", [employee_role_id]
        )
    } catch (error) {
        console.error("mali")
    }
}

//LISITNG ALL EMPLOYEE
async function listAllEmployees() {
    try {
        const [rows] = await pool.query("SELECT * FROM employees");
        console.log('All Employees:', rows);
    } catch (error) {
        console.error('Error listing employees:', error);
    }
}







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});