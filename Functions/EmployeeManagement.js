import pool from "./DBConnection.js";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Middleware to parse request bodies (if you're handling form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory and view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

const employeeManagementToken = {
    addEmployee,
    assignJobRole,
    updateEmployee,
    viewEmployee,
    deleteEmployee,
    addJobRole,
    removeJobRole,
    listAllEmployees
}

// ADDING NEW EMPLOYEE
async function addEmployee(employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) {
    try {
        const [result] = await pool.query(
            "INSERT INTO employees (employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) VALUES (?, ?, ?, ?, ?, ?)", 
            [employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// ASSIGN JOB ROLE
async function assignJobRole(employee_role_id, employee_id) {
    try {
        const [result] = await pool.query(
            "UPDATE employees SET employee_role_id = ? WHERE employee_id = ?", [employee_role_id, employee_id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// UPDATING EMPLOYEE DETAILS
async function updateEmployee(employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id) {
    try {
        const [result] = await pool.query(
            "UPDATE employees SET employee_first_name = ?, employee_last_name = ?, contact_info = ?, employee_role_id = ?, employee_salary = ? WHERE employee_id = ?", 
            [employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, employee_id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// VIEWING EMPLOYEE DETAILS
async function viewEmployee(employee_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM employees WHERE employee_id = ?", [employee_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
}

// REMOVING AN EMPLOYEE
async function deleteEmployee(employee_id) {
    try {
        const [result] = await pool.query("DELETE FROM employees WHERE employee_id = ?", [employee_id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// ADD JOB ROLE
async function addJobRole(employee_role_id, role_name) {
    try {
        const [result] = await pool.query(
            "INSERT INTO employee_roles (employee_role_id, role_name) VALUES (?, ?)", [employee_role_id, role_name]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// REMOVING JOB ROLE
async function removeJobRole(employee_role_id) {
    try {
        const [result] = await pool.query(
            "DELETE FROM employee_roles WHERE employee_role_id = ?", [employee_role_id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// LISTING ALL EMPLOYEES
async function listAllEmployees() {
    try {
        const [rows] = await pool.query("SELECT * FROM employees");
        return rows;
    } catch (error) {
        throw error;
    }
}

// ROUTES
app.get('/', async (req, res) => {
    try {
        const employees = await listAllEmployees();
        res.render('layout', {
            title: 'Employee List',
            content: 'index',  // Points to index.ejs as the content to include
            employees: employees  // Pass employees data to index.ejs
        });
    } catch (error) {
        res.status(500).send('Error fetching employees.');
    }
});


// FORM TO ADD NEW EMPLOYEE
app.get('/add-employee', (req, res) => {
    res.render('layout', {
        title: 'Add New Employee',
        content: 'add-employee'  // Points to add-employee.ejs
    });
});


app.post('/add-employee', async (req, res) => {
    const { employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary } = req.body;
    try {
        await addEmployee(employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding new employee.');
    }
});

// VIEW EMPLOYEE DETAILS
//app.get('/employee/:id', async (req, res) => {
//    try {
//        const employee = await viewEmployee(req.params.id);
//        if (employee) {
//            res.render('employee', { employee });
//        } else {
//            res.status(404).send('Employee not found.');
//        }
//    } catch (error) {
//        res.status(500).send('Error fetching employee details.');
//    }
//});

// FORM TO UPDATE EMPLOYEE
app.get('/employee/:id', async (req, res) => {
    try {
        const employee = await viewEmployee(req.params.id); // Fetch employee details
        if (employee) {
            res.render('layout', {
                title: 'Employee Details',
                content: 'employee',  // Points to employee.ejs
                employee  // Pass employee data to the view
            });
        } else {
            res.status(404).send('Employee not found.');  // Handle case where employee is not found
        }
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).send('Error fetching employee details.');
    }
});

app.get('/update-employee/:id', async (req, res) => {
    try {
        const employee = await viewEmployee(req.params.id); // Fetch employee details
        if (employee) {
            res.render('update-employee', { employee }); // Render the update form with employee data
        } else {
            res.status(404).send('Employee not found.'); // Handle case where employee is not found
        }
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).send('Error fetching employee details.'); // Handle errors
    }
});

app.post('/update-employee/:id', async (req, res) => {
    const { employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary } = req.body;
    const { id } = req.params;
    try {
        // Call the update function to update employee details
        await updateEmployee(employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, id);
        res.redirect(`/employee/${id}`);  // Redirect to the employee's detail page after update
    } catch (error) {
        console.error('Error updating employee:', error);  // Log the error
        res.status(500).send('Error updating employee.');  // Send an error response
    }   
});


// DELETE EMPLOYEE
app.post('/delete-employee/:id', async (req, res) => {
    try {
        await deleteEmployee(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting employee.');
    }
});

// ADD JOB ROLE
app.get('/add-job-role', (req, res) => {
    res.render('layout', {
        title: 'Add Job Role',
        content: 'add-job-role'  // Points to add-job-role.ejs
    });
});

app.post('/add-job-role', async (req, res) => {
    const { employee_role_id, role_name } = req.body;
    try {
        await addJobRole(employee_role_id, role_name);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding new job role.');
    }
});

// DELETE JOB ROLE
app.post('/delete-job-role/:id', async (req, res) => {
    try {
        await removeJobRole(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting job role.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default employeeManagementToken;