import express from 'express';
import { getAllEmployees, addEmployee, deleteEmployee } from '../controllers/EmployeeController.js';

const router = express.Router();

// Route to get all employees
router.get('/employees', getAllEmployees);

// Route to add an employee (usually would be a POST request)
router.post('/employees', addEmployee);

// Route to delete an employee
router.delete('/employees/:employee_id', deleteEmployee);

export default router;