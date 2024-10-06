// import functions
import EmployeeManager from './EmployeeManagement.js';

// employeesRoutes.js
import { Router } from 'express';
const app = Router();

// Define your routes
const setupRoutes = (app) => {
    Router.get('/', (req, res) => {
        res.render('index', { title: 'Home' });
    });

    Router.get('/about', (req, res) => {
        res.render('about', { title: 'About Us' });
    });

    // You can add more routes here

    // Use the router in the app
    app.use('/', Router);
};

// Route to display the Add Employee form
app.get('/add-employee', (req, res) => {
    res.render('add-employee');  // Render the add-employee.ejs form
});


export default setupRoutes;
