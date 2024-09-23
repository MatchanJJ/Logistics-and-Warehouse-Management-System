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
async function addEmployee(id, firstName, lastName, contactInfo, address) {
    try {
        const [result] = await pool.query(
            "INSERT INTO employee (id, first_name, last_name, contact_info, address) VALUES (?, ?, ?, ?, ?)", 
            [id, firstName, lastName, contactInfo, address]
        );
        console.log('Employee added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}

//UPDATING EMPLOYEE DETAILS
async function updateEmployee(id, firstName, lastName, contactInfo, address) {
    try {
        const [result] = await pool.query(
            "UPDATE employee SET first_name = ?, last_name = ?, contact_info = ?, address = ? WHERE id = ?", 
            [firstName, lastName, contactInfo, address, id]
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
async function viewEmployee(id) {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM employee WHERE id = ?", 
            [id]
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
async function deleteEmployee(id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM employee WHERE id = ?", 
            [id]
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

//ASSIGNING JOB ROLES
async function assignJobRole(employeeId, roleId, warehouseId) {
    try {
        const [result] = await pool.query(
            "INSERT INTO warehouse_management (id, employee_id, role_id, warehouse_id) VALUES (UUID(), ?, ?, ?)", 
            [employeeId, roleId, warehouseId]
        );
        console.log('Job role assigned to employee.');
    } catch (error) {
        console.error('Error assigning job role:', error);
    }
}

//LISITNG ALL EMPLOYEE
async function listAllEmployees() {
    try {
        const [rows] = await pool.query("SELECT * FROM employee");
        console.log('All Employees:', rows);
    } catch (error) {
        console.error('Error listing employees:', error);
    }
}







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});