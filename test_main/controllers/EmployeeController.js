import EmployeeService from '../services/EmployeeService.js';

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await EmployeeService.getEmployees(); // Calls the service method
        res.render('employee', { employees }); // Renders the employee view
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send('Error fetching employees');
    }
};

export const addEmployee = async (req, res) => {
    try {
        const { name, role, department } = req.body; // assuming these fields are sent
        const newEmployee = await EmployeeService.addEmployee(name, role, department);
        if (newEmployee) {
            res.redirect('/employees'); // Redirect to the employee list page after adding
        } else {
            res.status(400).send('Failed to add employee');
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).send('Error adding employee');
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const { employee_id } = req.params;
        const deleted = await EmployeeService.deleteEmployee(employee_id);
        if (deleted) {
            res.redirect('/employees'); // Redirect after deletion
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Error deleting employee');
    }
};
