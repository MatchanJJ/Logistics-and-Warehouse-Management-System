    import path from 'path';
    import { fileURLToPath } from 'url';
    import pool from './DBconnection/DBConnection.js';
    import express from 'express';
    import EmployeeService from './services/EmployeeService.js';
    import carrierPartnerTokens from './services/CarrierPartnerManagement.js';
    import orderTokens from './services/OrderManagement.js';
    import statusAndCategoriesManagementToken from './services/StatusAndCategoriesManagement.js';
    import ProductServiceToken from "./services/ProductService.js";
    import ParcelServiceToken from "./services/ParcelService.js";
    import WarehouseServices from './services/WarehouseServices.js';
    import LogService from './services/LogService.js';
    import ArchiveService from './services/ArchiveService.js';
    import ReturnService from './services/ReturnService.js';
    import OrderService from './services/OrderService.js';
    import StatAndCatService from './services/StatusAndCategoriesService.js';
    import CustomerService from './services/CustomerService.js';
    import CarrierService from './services/CarrierService.js';
    import InventoryService from './services/InventoryService.js';
    import ShipmentService from './services/ShipmentService.js';
    
    // Get __filename and __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Initialize Express
    const app = express();
    const port = 8080;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((req, res, next) => {
    console.log(req.body); // Log incoming request body
    next();
});

    // Middleware to parse request bodies (for POST requests)
    app.use(express.urlencoded({ extended: true }));

    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

    // Set the views directory and view engine
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    // Home route (blank or simple welcome message)
    app.get('/', (req, res) => {
        res.render('layout', {
            title: 'Home',
            content: 'home'  // Render the blank home page
        });
    });

// GET: Show form to add a new employee
app.get('/add-employee', async (req, res) => {
    try {
        const roles = await EmployeeService.listAllJobRoles(); // Fetch all roles from the database
        res.render('layout', { title: 'Add New Employee', content: 'add-employee', roles }); // Pass roles to the template
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).send('Error fetching roles.');
    }
});



// Route to handle form submission for adding a new employee
app.post('/add-employee', async (req, res) => {
    const { employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary } = req.body; // Extract form fields
    try {
        await EmployeeService.addEmployee( employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary); // Add the new employee
        res.redirect('/employees'); // Redirect to employee list after successful addition
    } catch (error) {
        console.error('Error adding new employee:', error);
        res.status(500).send('Error adding new employee.');
    }
});
// GET: List all job roles
app.get('/manage-job-roles', async (req, res) => {
    try {
        const jobRoles = await EmployeeService.listAllJobRoles(); // Fetch job roles from the database
        res.render('layout', { title: 'Manage Job Roles', content: 'manage-job-roles', jobRoles});
        //res.render('manage-job-roles', { jobRoles }); // Render the view and pass job roles
    } catch (error) {
        console.error('Error fetching job roles:', error);
        res.status(500).send('Error fetching job roles.');
    }
});

// GET: Show form to add a new job role
app.get('/add-job-role', (req, res) => {
    res.render('layout', { title: 'Add Job Role', content: 'add-job-role' }); // Render the layout with the add-warehouse content
    //res.render('add-job-role'); // Render the form to add a new job role
});

// POST: Add a new job role
app.post('/add-job-role', async (req, res) => {
    const { employee_role_id, role_name } = req.body; // Extract form fields
    try {
        await StatAndCatService.addEmployeeRole(role_name); // Add the new job role
        res.redirect('/manage-job-roles'); // Redirect to the job roles list after successful addition
    } catch (error) {
        console.error('Error adding job role:', error);
        res.status(500).send('Error adding job role.');
    }
});

// GET: Show form to update a job role
app.get('/update-job-role/:id', async (req, res) => {
    const { id } = req.params; // Extract the job role ID from the URL
    try {
        const jobRole = await EmployeeService.viewJobRole(id); // Fetch the job role by ID
        if (jobRole) {
            res.render('layout', { title: 'Update Job Role', content: 'update-job-role',jobRole });
            //res.render('update-job-role', { jobRole }); // Render the update form with the job role details
        } else {
            res.status(404).send('Job role not found.');
        }
    } catch (error) {
        console.error('Error fetching job role for update:', error);
        res.status(500).send('Error fetching job role.');
    }
});

// POST: Update a job role
app.post('/update-job-role/:id', async (req, res) => {
    const { id } = req.params; // Extract the job role ID from the URL
    const { role_name } = req.body; // Extract the new role name from the request body
    try {
        await EmployeeService.updateJobRole(id, role_name); // Update the job role
        res.redirect('/manage-job-roles'); // Redirect to the job roles list after successful update
    } catch (error) {
        console.error('Error updating job role:', error);
        res.status(500).send('Error updating job role.');
    }
});

// POST: Delete a job role
app.post('/delete-job-role/:id', async (req, res) => {
    const { id } = req.params; // Extract the job role ID from the URL
    try {
        await EmployeeService.removeJobRole(id); // Remove the job role
        res.redirect('/manage-job-roles'); // Redirect to the job roles list after successful deletion
    } catch (error) {
        console.error('Error deleting job role:', error);
        res.status(500).send('Error deleting job role.');
    }
});

// Route to display the Add Job Role form
app.get('/add-job-role', (req, res) => {
    res.render('add-job-role'); // Render the add-job-role.ejs form
});

// Route to handle form submission for adding a new job role
app.post('/add-job-role', async (req, res) => {
    const { employee_role_id, role_name } = req.body; // Extract form fields
    try {
        await EmployeeService.addJobRole(employee_role_id, role_name); // Add the new job role
        res.redirect('/employees'); // Redirect to employee list after successful addition
    } catch (error) {
        console.error('Error adding new job role:', error);
        res.status(500).send('Error adding new job role.');
    }
});


    // Employee route
    app.get('/employees', async (req, res) => {
        try {
            const employees = await EmployeeService.getEmployees();
            res.render('layout', {
                title: 'Employee List',
                content: 'employee',  // This should match the employees.ejs file
                employees  // Ensure this is passed
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).send('Error fetching employees.');
        }
    });

    //ROUTE FOR VIEWING
    app.get('/employee/:id', async (req, res) => {
        const { id } = req.params; // Extract employee ID from the route parameters
        try {
            const employee = await EmployeeService.viewEmployee(id); // Fetch employee details by ID
            if (employee) {
                res.render('layout', { title: 'View Employee', content: 'view-employee', employee }); // Render the layout with the add-warehouse content
                //res.render('view-employee', { employee }); // Render the employee details page
            } else {
                res.status(404).send('Employee not found.');
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).send('Error fetching employee.');
        }
    });
    

    app.get('/assign-employee/:id', async (req, res) => {
        const employeeId = req.params.id; // Get the employee ID from the URL
    
        try {
            // Fetch the current employee details
            const [employee] = await pool.query(`
                SELECT e.employee_id, CONCAT(e.employee_first_name, " ", e.employee_last_name) AS employee_name, e.employee_role_id, we.warehouse_id
                FROM employees e
                LEFT JOIN warehouse_employees we ON e.employee_id = we.employee_id
                WHERE e.employee_id = ?;
            `, [employeeId]);
    
            if (employee.length === 0) {
                return res.status(404).send('Employee not found');
            }
    
            // Fetch job roles and warehouses from the database
            const [warehouses] = await pool.query('SELECT warehouse_id FROM warehouses');
    
            // Render the page with the current employee, job roles, and warehouses
            res.render('layout', {
                title: 'Assign Employee',
                content: 'assign-employee',
                employee: employee[0],  // Send employee object
                warehouses,
                message: null
            });
        } catch (error) {
            console.error('Error fetching employee details:', error);
            res.status(500).send('Internal Server Error');
        }
    });



    app.post('/unassign-employee/:employee_id', async (req, res) => {
        const employee_id = req.params.employee_id;
    
        // Query to get the warehouse_id for the given employee_id
        const [rows] = await pool.query(`SELECT warehouse_id FROM warehouse_employees WHERE employee_id = ?`, [employee_id]);
    
        if (rows.length > 0) {
            const warehouse_id = rows[0].warehouse_id; // Extract the warehouse_id from the object
            console.log('Warehouse ID:', warehouse_id); // Log the warehouse ID for debugging
    
            const result = await EmployeeService.removeEmployeeFromWarehouse(warehouse_id, employee_id);
            
            if (result) {
                console.log('success_msg', `Employee ${employee_id} has been successfully unassigned from warehouse ${warehouse_id}.`);
            } else {
                console.log('error_msg', `Failed to unassign employee ${employee_id} from warehouse ${warehouse_id}.`);
            }
        } else {
            console.log('error_msg', `No warehouse found for employee ${employee_id}.`);
        }
    
        // Redirect back to the employee list or a relevant page
        res.redirect('/employee-logs'); // Adjust the redirect URL as needed
    });
    
    app.post('/assign-employee/:id', async (req, res) => {
        const employeeId = req.params.id; // Get the employee ID from the URL
        const {  warehouse_id } = req.body; // Extract form data
    
        try {
            // Assign job role and warehouse to the employee
            const warehouseSuccess = await EmployeeService.assignEmployeeToWarehouse(warehouse_id, employeeId);
    
            let message = 'Employee successfully assigned!';
            if (!warehouseSuccess) {
                message = 'Failed to assign employee to the warehouse.';
            }
    
            // Fetch updated employee details after assigning role and warehouse
            const [employee] = await pool.query(`
                SELECT e.employee_id, CONCAT(e.employee_first_name, " ", e.employee_last_name) AS employee_name, e.employee_role_id, we.warehouse_id
                FROM employees e
                LEFT JOIN warehouse_employees we ON e.employee_id = we.employee_id
                WHERE e.employee_id = ?;
            `, [employeeId]);
    
            // Fetch job roles and warehouses again to render the updated form
            const [warehouses] = await pool.query('SELECT warehouse_id FROM warehouses');
    
            // Render the page again with updated employee details and a message
            res.render('layout', {
                title: 'Assign Employee',
                content: 'assign-employee',
                employee: employee[0],  // Send the updated employee object
                warehouses,
                message
            });
        } catch (error) {
            console.error('Error assigning employee:', error);
            res.status(500).send('Internal Server Error');
        }
    });
        



 // Route for updating an employee (form rendering)
// GET: Show form to update an employee
app.get('/update-employee/:id', async (req, res) => {
    const { id } = req.params; // Extract employee ID from the route parameters
    try {
        const employee = await EmployeeService.getEmployeeData(id); // Fetch employee details by ID
        const jobRoles = await EmployeeService.listAllJobRoles(); // Fetch all job roles for the dropdown

        if (employee) {
            res.render('layout', { 
                title: 'Update Employee', 
                content: 'update-employee', 
                employee, 
                jobRoles // Pass the job roles to the view
            }); // Render the layout with the update-employee content
        } else {
            res.status(404).send('Employee not found.');
        }
    } catch (error) {
        console.error('Error fetching employee for update:', error);
        res.status(500).send('Error fetching employee.');
    }
});

// Route to handle form submission for updating an employee
app.post('/update-employee/:id', async (req, res) => {
    const { id } = req.params; // Extract employee ID from the route parameters
    const { employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary } = req.body; // Extract form fields

    // Log the values being updated for debugging
    console.log('Updating employee:', { id, employee_first_name, employee_last_name, contact_info, employee_salary, employee_role_id });

    try {
        // Call your management token to update employee details
        const updated = await EmployeeService.updateEmployee(employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary,  id);
        
        if (updated) {
            res.redirect(`/employee/${id}`); // Redirect to the employee details page after updating
        } else {
            res.status(404).send('Employee not found or no changes made.');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Error updating employee.');
    }
});

    app.post('/delete-employee/:id', async (req, res) => {
        try {
            await EmployeeService.removeEmployee(req.params.id);
            res.redirect('/employees'); // Redirect back to the employee list after deletion
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).send('Error deleting employee.');
        }
    });
    app.post('/delete-warehouse/:id', async (req, res) => {
        const warehouse_id = req.params.id; // Extract parcel ID from the route parameters
        try {
            await WarehouseServices.removeWarehouse(warehouse_id) // Call the delete function
            res.redirect('/warehouses'); // Redirect to the home page after deletion
        } catch (error) {
            res.status(500).send('Error deleting parcel.');
        }
    });

    // Warehouse route
    app.get('/warehouses', async (req, res) => {
        try {
            const warehouses = await WarehouseServices.getWarehouses(); // Correct the variable name
            res.render('layout', {
                title: 'Warehouse List',
                content: 'warehouses',  // Assuming you have a 'warehouses.ejs' file
                warehouses
            });
        } catch (error) {
            console.error('Error fetching warehouses:', error);  // Log the error to the console
            res.status(500).send('Error fetching warehouses.');  // Update error message
        }
    });
    
    
    // Route to render form for adding a new warehouse
    app.get('/add-warehouse', async (req, res) => {
        try {
        const [warehouseTypes] = await pool.query('SELECT warehouse_type_id, warehouse_type_name FROM warehouse_types');
        res.render('layout', { title: 'Add Warehouse', content: 'add-warehouse' , warehouseTypes}); // Render the layout with the add-warehouse content
        } catch (error) {
        console.error('Error fetching warehouse types:', error);
        res.status(500).send('Internal server error.');
        }
    });
    

 // Handle form submission for adding a new warehouse
app.post('/add-warehouse', async (req, res) => {
    const { warehouse_address, capacity, warehouse_type_id } = req.body; // Extract the form fields
    try {
        // Log the inputs to debug
        console.log('Adding warehouse:', {warehouse_address, capacity, warehouse_type_id });

        await WarehouseServices.addWarehouse( warehouse_address, capacity, warehouse_type_id);
        res.redirect('/warehouses'); // Redirect to the warehouse list after adding
    } catch (error) {
        console.error('Error adding warehouse:', error);
        res.status(500).send('Error adding warehouse.');
    }
});

app.get('/update-warehouse-capacity/:id', async (req, res) => {
    const warehouse_id = req.params.id;
    const warehouse = await WarehouseServices.getWarehouseById(warehouse_id);

    if (warehouse) {
        res.render('layout', { title: 'Update Warehouse Capacity', content: 'update-warehouse-capacity' ,warehouse}); // Render the layout with the add-warehouse content

       // res.render('update-warehouse-capacity', { warehouse });
    } else {
        res.status(404).send('Warehouse not found');
    }
});

// POST route to handle the form submission
app.post('/update-warehouse-capacity/:id', async (req, res) => {
    const warehouse_id = req.params.id;
    const new_capacity = req.body.new_capacity;

    const updateSuccess = await WarehouseServices.updateWarehouseCapacity(warehouse_id, new_capacity);

    if (updateSuccess) {
        res.redirect('/warehouses'); // Redirect to a relevant page after success
    } else {
        res.status(500).send('Error updating warehouse capacity');
    }
});

    // Route to render form for updating a warehouse
// Assuming you have an Express router instance
app.get('/update-warehouse/:id', async (req, res) => {
    const warehouse_id = req.params.id;
    res.render('layout', { title: 'Update Warehouse', content: 'update-warehouse', warehouse_id }); // Render the layout with the add-warehouse content

    //res.render('update-warehouse', { warehouse_id });
});

app.get('/update-warehouse-location/:warehouse_id', async (req, res) => {
    const warehouseId = req.params.warehouse_id;  // warehouse_id from the URL
    console.log("Warehouse ID:", warehouseId); // Debugging line to check the ID being passed

    try {
        // Retrieve the warehouse location ID based on the warehouse ID
        const warehouseLocationId = await WarehouseServices.getWarehouseLocationId(warehouseId);
        console.log("Warehouse Location ID:", warehouseLocationId); // Debugging line to check retrieved warehouse_location_id

        if (warehouseLocationId) {
            // Render the view with the correct warehouse_location_id
            res.render('layout', { 
                title: 'Update Warehouse Location', 
                content: 'update-warehouse-location',  
                warehouse_location_id: warehouseLocationId // Pass warehouse_location_id to the EJS template
            });
        } else {
            res.status(404).send(`No warehouse location found with the given details for warehouse ID: ${warehouseId}`);
        }
    } catch (error) {
        console.error('Error retrieving warehouse location:', error);
        res.status(500).send('Error retrieving warehouse location details');
    }
});


app.post('/update-warehouse-location/:warehouse_location_id', async (req, res) => {
    const warehouseLocationId = req.params.warehouse_location_id;  // Use the warehouse_location_id from the URL
    const { section, aisle, rack, shelf, bin } = req.body;
    console.log("passed", warehouseLocationId);
    try {
        // Call your async function to update the warehouse location using warehouse_location_id
        const updateSuccessful = await WarehouseServices.updateWarehouseLocation(warehouseLocationId, section, aisle, rack, shelf, bin);

        if (updateSuccessful) {
            // Redirect to the list of warehouses after successful update
            res.redirect('/warehouses');
        } else {
            res.status(404).send(`No warehouse location found with ID: ${warehouseLocationId}`);
        }
    } catch (error) {
        console.error('Error updating warehouse location:', error);
        res.status(500).send('Error updating warehouse location');
    }
});



// Route to check warehouse availability
app.get('/check-availability', async (req, res) => {
    try {
        const warehouses = await WarehouseServices.getWarehouses(); // Get the list of all warehouses
        const warehouseAvailability = [];

        // Check availability for each warehouse
        for (const warehouse of warehouses) {
            const isEmptyResult = await WarehouseServices.isEmpty(warehouse.warehouse_id);
            const isFullResult = await WarehouseServices.isFull(warehouse.warehouse_id);

            let availabilityStatus;
            if (isEmptyResult) {
                availabilityStatus = 'Available';
            } else if (isFullResult) {
                availabilityStatus = 'Full';
            } else {
                availabilityStatus = 'Available';  // You can customize this label
            }

            warehouseAvailability.push({
                ...warehouse,
                isAvailable: availabilityStatus
            });
        }

        // Render the availability view
        res.render('layout', { 
            title: 'Warehouse Availability',
            content: 'check-availability',  // The EJS file for specific content
            warehouseAvailability  // Pass any data needed by the content page
        });
    } catch (error) {
        console.error('Error checking warehouse availability:', error);
        res.status(500).send('Error checking warehouse availability.');
    }
});


app.get('/parcel', async (req, res) => {
    try {
        const parcels = await ParcelServiceToken.getParcels(); // Assuming this function exists
        res.render('layout', {
            title: 'Parcel Inventory',
            content: 'parcel',
            parcels // Pass the parcels data to the view
        });
    } catch (error) {
        console.error('Error fetching parcels:', error);
        res.status(500).send('Error fetching parcels.');
    }
});

app.get('/product', async (req, res) => {
    try {
        const products = await ProductServiceToken.getProducts(); // Assuming this function exists
        res.render('layout', {
            title: 'Product Inventory',
            content: 'product',
            products // Pass the products data to the view
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products.');
    }
});


app.get('/inventories', async (req, res) => {
    try {
        const inventory = await InventoryService.getInventory(); // Call the function to fetch inventory data
        res.render('layout', {
            title: 'Warehouse Inventory',
            content: 'inventories', // Assuming you have 'inventory.ejs' for the inventory table
            inventory // Pass the inventory data to the view
        });
    } catch (error) {
        console.error('Error retrieving inventory:', error);
        res.status(500).send('Error retrieving inventory.');
    }
});
app.get('/add-parcel', async (req, res) => {
    try {
        const [parcelCategories] = await pool.query('SELECT parcel_category_id, parcel_category_name FROM parcel_categories');
        res.render('layout', { title: 'Add Parcel', content: 'add-parcel', parcelCategories }); // Render the layout with the add-warehouse content
    } catch (error) {
        console.error('Error fetching parcel categories:', error);
        res.status(500).send('Server Error');
    }
});

    app.post('/add-parcel', async (req, res) => {
        // Extract data from the form submission
        const {
            parcel_category_id,
            parcel_description,
            parcel_unit_price,
            parcel_weight,
            parcel_length,
            parcel_width,
            parcel_height,
            is_fragile,
            is_perishable,
            is_hazardous,
            is_oversized,
            is_returnable,
            is_temperature_sensitive
        } = req.body;
    
        try {
            // Add the new parcel using the addParcel service method
            const result = await ParcelServiceToken.addParcel(
                parcel_category_id,
                parcel_description,
                parcel_unit_price,
                parcel_weight,
                parcel_length,
                parcel_width,
                parcel_height,
                !!is_fragile, // Convert to boolean
                !!is_perishable, // Convert to boolean
                !!is_hazardous, // Convert to boolean
                !!is_oversized, // Convert to boolean
                !!is_returnable, // Convert to boolean
                !!is_temperature_sensitive // Convert to boolean
            );
    
            if (result) {
                // Redirect or render a success page
                res.redirect('/parcel');
            } else {
                res.status(500).send('Failed to add parcel.');
            }
        } catch (error) {
            console.error('Error adding parcel:', error);
            res.status(500).send('Error adding parcel.');
        }
    });
    

    // Handle the form submission for adding a new parcel

app.get('/view-parcel/:parcel_id', async (req, res) => {
    const parcelId = req.params.parcel_id;

    try {
        const parcel = await ParcelServiceToken.findParcel(parcelId); // Await the async function

        if (parcel) {
            res.render('layout', { title: 'Parcel Details', content: 'view-parcel', parcel });
        } else {
            res.status(404).send('Parcel not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
// Route to render the assign parcel form with current parcel details
app.get('/assign-parcel/:id', async (req, res) => {
    const parcelId = req.params.id;

    try {
        // Fetch current parcel details from the database
        const [parcel] = await pool.query(`
            SELECT parcel_id, parcel_length, parcel_width, parcel_height, parcel_description 
            FROM parcels 
            WHERE parcel_id = ?;
        `, [parcelId]);

        if (parcel.length === 0) {
            return res.status(404).send('Parcel not found'); // Handle case where parcel is not found
        }

        res.render('layout', { title: 'Assign Parcel', content: 'assign-parcel' , message: null, parcel: parcel[0]}); // Render the layout with the add-warehouse content
       // res.render('assign-parcel', { message: null, parcel: parcel[0] });
    } catch (error) {
        console.error('Error fetching parcel details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the form submission
app.post('/assign-parcel/:id', async (req, res) => {
    const parcelId = req.params.id; // Get the parcel ID from the URL
    const { warehouse_id, section, aisle, rack, shelf, bin, quantity } = req.body;
    console.log(quantity);

    const success = await InventoryService.assignParcel(parcelId, warehouse_id, section, aisle, rack, shelf, bin);
    const message = success ? 'Parcel successfully assigned.' : 'Failed to assign parcel. Please check your inputs.';

    // Render the 'layout' template, injecting 'assign-parcel' content
    res.render('layout', { 
        title: 'Assign Parcel', 
        content: 'assign-parcel', // This is the view/partial to be rendered inside layout
        message, 
        parcel: { parcel_id: parcelId, ...req.body } 
    });
});




    // Route for editing a parcel (render form with existing data)
    app.get('/edit-parcel/:id', async (req, res) => {
        const parcel_id = req.params.id; // Extract parcel ID from the route parameters
        try {
            const parcel = await ParcelServiceToken.findParcel(parcel_id); // Fetch parcel details
            if (parcel) {
                res.render('layout', { title: 'Edit Parcel', content: 'edit-parcel' , parcel}); // Render the layout with the add-warehouse content
                //res.render('edit-parcel', { parcel }); // Render the edit form with parcel data
            } else {
                res.status(404).send('Parcel not found.');
            }
        } catch (error) {
            res.status(500).send('Error retrieving parcel for editing.');
        }
    });

    // Serve the edit parcel prompt page
app.get('/edit-parcel-prompt/:id', async (req, res) => {
    const parcel_id = req.params.id;

    // Fetch parcel details if needed
    try {
        const parcel = await ParcelServiceToken.findParcel(parcel_id);
        res.render('layout', { title: 'Edit Parcel Option', content: 'edit-parcel-option' , parcel}); // Render the layout with the add-warehouse content
    } catch (error) {
        console.error('Error fetching parcel:', error);
        res.status(500).send('Error fetching parcel.');
    }
});

// GET route to display the update parcel stock quantity form
app.get('/update-parcel-stock-quantity/:id', async (req, res) => {
    const parcel_id = req.params.id;
    
    try {
        const parcel = await ParcelServiceToken.findParcel(parcel_id);
        res.render('layout', { title: 'Update Parcel Stock Quantity', content: 'update-parcel-stock-quantity' , parcel}); // Render the layout with the add-warehouse content
    } catch (error) {
        console.error('Error fetching parcel details:', error);
        res.status(500).send('Error fetching parcel details.');
    }
});

// POST route to handle updating parcel stock quantity
app.post('/update-parcel-stock-quantity/:id', async (req, res) => {
    const parcel_id = req.params.id;
    const { warehouse_id, new_quantity } = req.body;

    try {
        const updated = await InventoryService.updateParcelStockQuantity(parcel_id, warehouse_id, new_quantity);
        if (updated) {
            res.redirect('/parcel');  // Redirect to the parcel listing page after a successful update
        } else {
            res.status(500).send('Error updating parcel stock quantity.');
        }
    } catch (error) {
        console.error('Error updating stock quantity:', error);
        res.status(500).send('Error updating parcel stock quantity.');
    }
});

// GET route to display the update parcel location form
app.get('/update-parcel-location/:id', async (req, res) => {
    const parcel_id = req.params.id;
    
    try {
        const parcel = await ParcelServiceToken.findParcel(parcel_id);  // Fetch parcel details if necessary
        res.render('layout', { title: 'Update Parcel Location', content: 'update-parcel-location' , parcel}); // Render the layout with the add-warehouse content
    } catch (error) {
        console.error('Error fetching parcel details:', error);
        res.status(500).send('Error fetching parcel details.');
    }
});

// POST route to handle updating parcel location
app.post('/update-parcel-location/:id', async (req, res) => {
    const parcel_id = req.params.id;
    const { warehouse_id, section, aisle, rack, shelf, bin } = req.body;

    try {
        const updated = await InventoryService.updateParcelLocation(parcel_id, warehouse_id, section, aisle, rack, shelf, bin);
        if (updated) {
            res.redirect('/parcel');  // Redirect to the parcel listing page after a successful update
        } else {
            res.status(500).send('Error updating parcel location.');
        }
    } catch (error) {
        console.error('Error updating parcel location:', error);
        res.status(500).send('Error updating parcel location.');
    }
});


    // Handle the form submission for updating a parcel
    app.post('/edit-parcel-option/:id', async (req, res) => {
        const parcel_id = req.params.id; 
        const { 
            parcel_category_id, 
            parcel_description, 
            parcel_unit_price, 
            parcel_weight, 
            parcel_length, 
            parcel_width, 
            parcel_height, 
            is_fragile, 
            is_perishable, 
            is_hazardous, 
            is_oversized, 
            is_returnable, 
            is_temperature_sensitive 
        } = req.body;
        console.log({
            is_fragile,
            is_perishable,
            is_hazardous,
            is_oversized,
            is_returnable,
            is_temperature_sensitive
        });
        
        // Convert checkbox values to boolean
        const isFragile = !!is_fragile; // true if checked, false if not
        const isPerishable = !!is_perishable;
        const isHazardous = !!is_hazardous;
        const isOversized = !!is_oversized;
        const isReturnable = !!is_returnable;
        const isTemperatureSensitive = !!is_temperature_sensitive;
    
        try {
            await ParcelServiceToken.updateParcel(
                parcel_category_id,
                parcel_description,
                parcel_unit_price,
                parcel_weight,
                parcel_length,
                parcel_width,
                parcel_height,
                isFragile,
                isPerishable,
                isHazardous,
                isOversized,
                isReturnable,
                isTemperatureSensitive,
                parcel_id
            );
            res.redirect('/parcel'); 
        } catch (error) {
            console.error('Error updating parcel:', error);
            res.status(500).send('Error updating parcel.');
        }
    });
    
    

    // Route for deleting a parcel
    app.post('/delete-parcel/:id', async (req, res) => {
        const parcel_id = req.params.id; // Extract parcel ID from the route parameters
        try {
            await ParcelServiceToken.removeParcel(parcel_id)
            res.redirect('/parcel'); // Redirect to the home page after deletion
        } catch (error) {
            res.status(500).send('Error deleting parcel.');
        }
    });

    // Route to fetch product details and render the assignment form
app.get('/assign-product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Fetch current product details from the database
        const [product] = await pool.query(`
            SELECT product_id, product_length, product_width, product_height, product_description 
            FROM products 
            WHERE product_id = ?;
        `, [productId]);

        if (product.length === 0) {
            return res.status(404).send('Product not found'); // Handle case where product is not found
        }

        res.render('layout', { title: 'Assign Product', content: 'assign-product' , message: null, product: product[0]}); // Render the layout with the add-warehouse content
        //res.render('assign-product', { message: null, product: product[0] });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the form submission for product assignment
app.post('/assign-product/:id', async (req, res) => {
    const productId = req.params.id; // Get the product ID from the URL
    const { warehouse_id, section, aisle, rack, shelf, bin, quantity } = req.body;

    const success = await InventoryService.assignProduct(productId, warehouse_id, section, aisle, rack, shelf, bin, quantity);
    res.redirect('/product'); // Redirect to the home page after adding

    const message = success ? 'Product successfully assigned.' : 'Failed to assign product. Please check your inputs.';

    // Render the 'layout' template, injecting 'assign-product' content
    res.render('layout', { 
        title: 'Assign Product', 
        content: 'assign-product', // This is the view/partial to be rendered inside layout
        message, 
        product: { product_id: productId, ...req.body } 
    });
});

app.get('/add-product', async (req, res) => {
    try {
        const [productCategories] = await pool.query('SELECT product_category_id, product_category_name FROM product_categories');
        res.render('layout', { title: 'Add Product', content: 'add-product', productCategories }); // Render the layout with the add-warehouse content
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).send('Server Error');
    }
});


    // Handle the form submission for adding a new product
    app.post('/add-product', async (req, res) => {
        const { product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive } = req.body;
        try {
            await ProductServiceToken.addProduct(product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, !!is_fragile, // Convert to boolean
                !!is_perishable, // Convert to boolean
                !!is_hazardous, // Convert to boolean
                !!is_oversized, // Convert to boolean
                !!is_returnable, // Convert to boolean
                !!is_temperature_sensitive );
            res.redirect('/product'); // Redirect to the home page after adding
        } catch (error) {
            res.status(500).send('Error adding product.');
        }
    });

    app.get('/view-product/:parcel_id', async (req, res) => {
        const productId = req.params.parcel_id;
    
        try {
            const product = await ProductServiceToken.viewProduct(productId); // Await the async function
    
            if (product) {
                res.render('layout', { title: 'Product Details', content: 'view-product', product });
            } else {
                res.status(404).send('Parcel not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

// GET route to display the stock quantity update form
app.get('/update-product-stock-quantity/:id', async (req, res) => {
    const product_id = req.params.id;
    try {
        const product = await ProductServiceToken.viewProduct(product_id);
        if (product) {
            res.render('layout', { title: 'Update Product Stock Quantity', content: 'update-product-stock-quantity',product }); // Render the layout with the add-warehouse content
        } else {
            res.status(404).send('Product not found.');
        }
    } catch (error) {
        console.error('Error fetching product for stock quantity update:', error);
        res.status(500).send('Error fetching product.');
    }
});

// POST route to handle stock quantity update form submission
app.post('/update-product-stock-quantity/:id', async (req, res) => {
    const product_id = req.params.id;
    const { warehouse_id, new_quantity } = req.body;

    try {
        const updated = await InventoryService.updateProductStockQuantity(product_id, warehouse_id, new_quantity);
        if (updated) {
            res.redirect(`/product`);
        } else {
            res.status(404).send('Product or Warehouse not found.');
        }
    } catch (error) {
        console.error('Error updating product stock quantity:', error);
        res.status(500).send('Error updating stock quantity.');
    }
});

// GET route to display the location update form
app.get('/update-product-location/:id', async (req, res) => {
    const product_id = req.params.id;
    try {
        const product = await ProductServiceToken.viewProduct(product_id);
        if (product) {
            res.render('layout', { title: 'Edit Product Location', content: 'update-product-location',product }); // Render the layout with the add-warehouse content
           // res.render('update-product-location', { product });
        } else {
            res.status(404).send('Product not found.');
        }
    } catch (error) {
        console.error('Error fetching product for location update:', error);
        res.status(500).send('Error fetching product.');
    }
});

// POST route to handle location update form submission
app.post('/update-product-location/:id', async (req, res) => {
    const product_id = req.params.id;
    const { warehouse_id, section, aisle, rack, shelf, bin } = req.body;

    try {
        const updated = await InventoryService.updateProductLocation(product_id, warehouse_id, section, aisle, rack, shelf, bin);
        if (updated) {
            res.redirect(`/manage-product-orders`);
        } else {
            res.status(404).send('Product or Warehouse not found.');
        }
    } catch (error) {
        console.error('Error updating product location:', error);
        res.status(500).send('Error updating location.');
    }
});


    // Route to show the prompt for editing a product
app.get('/edit-product-option/:id', async (req, res) => {
    const product_id = req.params.id; // Extract product ID from the route parameters
    try {
        const product = await ProductServiceToken.viewProduct(product_id); // Fetch product details
        if (product) {
            res.render('layout', { title: 'Edit Product Option', content: 'edit-product-option',product }); // Render the layout with the add-warehouse content

        } else {
            res.status(404).send('Product not found.');
        }
    } catch (error) {
        console.error('Error fetching product for edit prompt:', error);
        res.status(500).send('Error retrieving product for editing.');
    }
});


    // Route for editing a product (render form with existing data)
    app.get('/edit-product/:id', async (req, res) => {
        const product_id = req.params.id; // Extract product ID from the route parameters
        try {
            const product = await ProductServiceToken.viewProduct(product_id); // Fetch product details
            if (product) {
                res.render('layout', { title: 'Edit Product', content: 'edit-product',product }); // Render the layout with the add-warehouse content
                //res.render('edit-product', { product }); // Render the edit form with product data
            } else {
                res.status(404).send('Product not found.');
            }
        } catch (error) {
            res.status(500).send('Error retrieving product for editing.');
        }
    });

    // Handle the form submission for updating a product
    app.post('/edit-product/:id', async (req, res) => {
        const product_id = req.params.id; 
        //console.log('Received req.body:', req.body); // Log the entire req.body

        const { 
            product_category_id, 
            product_name, 
            product_brand, 
            product_supplier, 
            product_description, 
            product_unit_price,
            product_weight, 
            product_length, 
            product_width, 
            product_height, 
            is_fragile, 
            is_perishable, 
            is_hazardous, 
            is_oversized,
            is_returnable,
            is_temperature_sensitive 
        } = req.body;

        console.log({
            is_fragile,
            is_perishable,
            is_hazardous,
            is_oversized,
            is_returnable,
            is_temperature_sensitive
        });
        
        // Convert checkbox values to boolean
        const isFragile = !!is_fragile; // true if checked, false if not
        const isPerishable = !!is_perishable;
        const isHazardous = !!is_hazardous;
        const isOversized = !!is_oversized;
        const isReturnable = !!is_returnable;
        const isTemperatureSensitive = !!is_temperature_sensitive;
    
        try {
            await ProductServiceToken.updateProduct(
                product_category_id, 
                product_name, 
                product_brand, 
                product_supplier, 
                product_description, 
                product_unit_price,
                product_weight, 
                product_length, 
                product_width, 
                product_height,
                isFragile,
                isPerishable,
                isHazardous,
                isOversized,
                isReturnable,
                isTemperatureSensitive,
                product_id
            );
            const [updatedProduct] = await pool.query(
                `SELECT * FROM products WHERE product_id = ?`, 
                [product_id]
            );
        
            console.log('Updated Product:', updatedProduct);
            res.redirect('/product'); 
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).send('Error updating product.');
        }
    });
    
    
    
    // Route for deleting a product
    app.post('/delete-product/:id', async (req, res) => {
        const product_id = req.params.id; // Extract product ID from the route parameters
        try {
            await ProductServiceToken.removeProduct(product_id) // Call the delete function
            res.redirect('/product'); // Redirect to the home page after deletion
        } catch (error) {
            res.status(500).send('Error deleting product.');
        }
    });

// Customer route to list all customers
app.get('/customers', async (req, res) => {
    try {
        const customers = await CustomerService.getCustomers(); // Fetch all customers
        res.render('layout', {
            title: 'Customer List',
            content: 'customer',  // This should match the customers.ejs file
            customers  // Pass customers to the view
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send('Error fetching customers.');
    }
});

// Route to view a specific customer by ID
app.get('/customers/:id', async (req, res) => {
    const customer_id = req.params.id; // Extract customer ID from the route parameters
    try {
        const customer = await CustomerService.viewCustomerInfo(customer_id); // Fetch customer details
        if (customer) {
            res.render('layout', {
                title: 'Customer Details',
                content: 'view-customer',  // This should match the customers.ejs file
                customer  // Pass customers to the view
            });
            
           // res.render('view-customer', { customer }); // Render the view-customer.ejs template
        } else {
            res.status(404).send('Customer not found.');
        }
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).send('Error fetching customer.');
    }
});

// Route to render form for adding a new customer
app.get('/add-customer', (req, res) => {
    res.render('layout', { title: 'Add Customer', content: 'add-customer' }); // Render the layout with the add-warehouse content
});

// Handle form submission for adding a new customer
app.post('/add-customer', async (req, res) => {
    const { customer_first_name, customer_last_name, customer_email, customer_address } = req.body;
    try {
        await CustomerService.addCustomer(customer_first_name, customer_last_name, customer_email, customer_address);
        res.redirect('/customers'); // Redirect to the customer list after adding
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).send('Error adding customer.');
    }
});
// Main.js

// Route for viewing a specific customer by ID
app.get('/customer/:id', async (req, res) => {
    const customer_id = req.params.id; // Extract customer ID from the route parameters
    try {
        const customer = await CustomerService.viewCustomerInfo(customer_id); // Fetch customer details
        if (customer) { 
            res.render('layout', { title: 'View Customer', content: 'view-customer', customer });
            //res.render('view-customer', { customer }); // Render the view-customer.ejs template
        } else {
            res.status(404).send('Customer not found.');
        }
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).send('Error fetching customer.');
    }
});


// Route to render form for updating a customer
app.get('/update-customer/:id', async (req, res) => {
    const { id } = req.params; // Extract customer ID from the route parameters
    try {
        const customer = await CustomerService.viewCustomerInfo(id); // Fetch customer details
        if (customer) {
            res.render('layout', { title: 'Update Customer', content: 'update-customer',customer });
            //res.render('update-customer', { customer }); // Render the update form
        } else {
            res.status(404).send('Customer not found.');
        }
    } catch (error) {
        console.error('Error fetching customer for update:', error);
        res.status(500).send('Error fetching customer.');
    }
});


// Route to update a specific customer
app.post('/customers/:id', async (req, res) => {
    const customer_id = req.params.id;
    const { customer_first_name, customer_last_name, customer_email, customer_address } = req.body;
    try {
        const updated = await CustomerService.updateCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address);
        if (updated) {
            res.redirect(`/customers/${customer_id}`); // Redirect to the customer's detail page after update
        } else {
            res.status(404).send('Customer not found.');
        }
    } catch (error) {
        res.status(500).send('Error updating customer.');
    }
});


// Handle form submission for updating a customer
app.post('/update-customer/:id', async (req, res) => {
    const { id } = req.params; // Extract customer ID from the route parameters
    const { customer_first_name, customer_last_name, customer_email, customer_address } = req.body;
    try {
        const updated = await CustomerService.updateCustomer(id, customer_first_name, customer_last_name, customer_email, customer_address);
        if (updated) {
            res.redirect(`/customer/${id}`); // Redirect to the customer details page after updating
        } else {
            res.status(404).send('Customer not found.');
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).send('Error updating customer.');
    }
});

// Route for deleting a customer
app.post('/delete-customer/:id', async (req, res) => {
    const { id } = req.params; // Extract customer ID from the route parameters
    try {
        const deleted = await CustomerService.removeCustomer(id); // Call the delete function
        if (deleted) {
            res.redirect('/customers'); // Redirect to the customer list after deletion
        } else {
            res.status(404).send('Customer not found.');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).send('Error deleting customer.');
    }
});



app.get('/shipments', async (req, res) => {
    try {
        const shipments = await ShipmentService.getShipments(); // Fetch all shipments
        res.render('layout', {
            title: 'Shipment List',
            content: 'shipments', // This should match the shipments.ejs file
            shipments // Pass the shipments data to the view
        });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).send('Error fetching shipments.');
    }
});

app.get('/shipment-actions/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters

        res.render('layout', { title: 'Shipment Actions', content: 'shipment-actions', shipment_id });

});

// GET route to render the form to update the current location of a shipment
app.get('/shipment-update-current-location/:id', (req, res) => {
    const shipment_id = req.params.id;
    res.render('layout', { title: 'Update Shipment Location', content: 'update-shipment-location', shipment_id });
});

// POST route to handle the form submission and update the current location
app.post('/shipment-update-current-location/:id', async (req, res) => {
    const shipment_id = req.params.id;
    const new_current_location = req.body.new_current_location;

    const success = await ShipmentService.updateShipmentCurrentLocation(shipment_id, new_current_location);

    if (success) {
        res.redirect(`/shipments`);
    } else {
        res.status(500).send('Failed to update shipment location');
    }
});

app.get('/shipment-deliver/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    try {
        await ShipmentService.shipmentDelivered(shipment_id);
        res.redirect('/shipments'); // Redirect to the shipment list after adding
    } catch (error) {
        console.error('Error adding shipment:', error);
        res.status(500).send('Error adding shipment.');
    }
        //res.render('layout', { title: 'Shipment Actions', content: 'shipment-actions', shipment_id });

});
app.get('/shipment-remove/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    try {
        await ShipmentService.removeShipment(shipment_id);
        res.redirect('/shipments'); // Redirect to the shipment list after adding
    } catch (error) {
        console.error('Error adding shipment:', error);
        res.status(500).send('Error adding shipment.');
    }
        //res.render('layout', { title: 'Shipment Actions', content: 'shipment-actions', shipment_id });

});
app.get('/shipment-failed/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    try {
        await ShipmentService.shipmentFailed(shipment_id);
        res.redirect('/shipments'); // Redirect to the shipment list after adding
    } catch (error) {
        console.error('Error adding shipment:', error);
        res.status(500).send('Error adding shipment.');
    }
        //res.render('layout', { title: 'Shipment Actions', content: 'shipment-actions', shipment_id });

});

// GET route to render the return form
app.get('/shipment-return/:id', (req, res) => {
    const shipment_id = req.params.id;
    res.render('layout', { title: 'Return Shipment', content: 'return-shipment', shipment_id });
});

// POST route to handle the return shipment action
app.post('/shipment-return/:id', async (req, res) => {
    const shipment_id = req.params.id;
    const return_reason = req.body.return_reason;

    const success = await ShipmentService.returnShipment(shipment_id, return_reason);

    if (success) {
        res.redirect(`/shipments`);
    } else {
        res.status(500).send('Failed to return shipment');
    }
});



// Route to render form for adding a new shipment
app.get('/add-shipment', (req, res) => {
    res.render('layout', { title: 'Add Shipment ', content: 'add-shipment' });
    //res.render('add-shipment'); // Render the form for adding a new shipment
});

// Handle form submission for adding a new shipment
app.post('/add-shipment', async (req, res) => {
    const { order_id, carrier_id, shipping_service_id, shipping_address,  estimated_delivery_date } = req.body;
    try {
        await ShipmentService.addShipment( order_id, carrier_id, shipping_service_id, shipping_address,  estimated_delivery_date);
        res.redirect('/shipments'); // Redirect to the shipment list after adding
    } catch (error) {
        console.error('Error adding shipment:', error);
        res.status(500).send('Error adding shipment.');
    }
});

// Route to render form for updating a shipment
app.get('/update-shipment/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    try {
        const shipment = await ShipmentService.findShipmentById(shipment_id); // Fetch shipment details
        if (shipment) {
            res.render('layout', { title: 'Update Shipment', content: 'update-shipment', shipment });
            //res.render('update-shipment', { shipment }); // Render the update form
        } else {
            res.status(404).send('Shipment not found.');
        }
    } catch (error) {
        console.error('Error fetching shipment for update:', error);
        res.status(500).send('Error fetching shipment.');
    }
});

// Route for deleting a shipment
app.post('/delete-shipment/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    try {
        await ShipmentService.removeShipment(shipment_id); // Call the delete function
        res.redirect('/shipments'); // Redirect to the shipment list after deletion
    } catch (error) {
        console.error('Error deleting shipment:', error);
        res.status(500).send('Error deleting shipment.');
    }
});

// Route to manage logistics partners
app.get('/manage-partner', async (req, res) => {
    try {
        // Fetch partners from the database
        const partners = await carrierPartnerTokens.listAllLogisticsPartners();

        // Render the layout with the partner view as content
        res.render('layout', {
            title: 'Manage Partners', // Set the title for the layout
            content: 'partner-content', // This should match the name of your EJS file without the .ejs extension
            partners // Pass the fetched partners to the partner view
        });
    } catch (error) {
        console.error('Error fetching logistics partners:', error);
        res.status(500).send('Error fetching logistics partners.');
    }    
});
app.get('/add-partner', async (req, res) => {
    try {
        // Fetch the shipping services from the database
        const [shippingServices] = await pool.query('SELECT shipping_service_id, shipping_service_name FROM shipping_services');

        // Render the form and pass the fetched shipping services
        res.render('layout', { title: 'Add Logistic Partner', content: 'add-partner', shippingServices }); // Render the layout with the add-warehouse content
    } catch (error) {
        console.error('Error fetching shipping services:', error);
        res.status(500).send('Internal server error.');
    }
});



// Route to handle form submission for adding a new partner
app.post('/add-partner', async (req, res) => {
    const {  carrier_name, shipping_service_id, carrier_contact_info } = req.body; // Extract form fields
    try {
        await CarrierService.addCarrier( carrier_name, shipping_service_id, carrier_contact_info); // Add the new partner
        res.redirect('/manage-partner'); // Redirect to partner management page after successful addition
    } catch (error) {
        console.error('Error adding new partner:', error);
        res.status(500).send('Error adding new partner.');
    }
});

// Route to display the Update Partner form
app.get('/update-partner/:id', async (req, res) => {
    try {
        const partner = await carrierPartnerTokens.viewLogisticsPartner(req.params.id); // Fetch the partner by ID
        if (partner) {
            res.render('layout', { title: 'Update Logistic Partner', content: 'update-partner', partner }); // Render the layout with the add-warehouse content
            //res.render('update-partner', { partner }); // Render the update form with the partner details
        } else {
            res.status(404).send('Partner not found.');
        }
    } catch (error) {
        console.error('Error fetching partner for update:', error);
        res.status(500).send('Error fetching partner.');
    }
});

// Route to handle form submission for updating the partner
app.post('/update-partner/:id', async (req, res) => {
    const { carrier_name, shipping_service_id, carrier_contact_info } = req.body; // Extract updated values
    const { id } = req.params; // Get the partner ID from the route
    try {
        await CarrierService.updateCarrier(carrier_name, shipping_service_id, carrier_contact_info, id); // Update the partner
        res.redirect(`/manage-partner`); // Redirect to the partner details page after update
    } catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).send('Error updating partner.');
    }
});

// DELETE A PARTNER
app.post('/delete-partner/:id', async (req, res) => {
    try {
        await CarrierService.removeCarrier(req.params.id); // Delete the partner
        res.redirect('/manage-partner'); // Redirect back to partner management page
    } catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).send('Error deleting partner.');
    }
});
app.get('/orders', async (req, res) => {
    try {
        const orders = await OrderService.getOrders(); 
        res.render('layout', {
            title: 'Order Management',
            content: 'orders', // Specify the content to include
            orders // Pass orders data if needed in the orders.ejs
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders.');
    }
});

app.get('/manage-orders', (req, res) => {
    res.render('layout', { title: 'Manage Orders', content: 'manage-order' }); // Render the layout with the add-warehouse content
    //res.render('manage-order'); // Render the orders page
});

// Route to manage postal orders
app.get('/postal-orders', async (req, res) => {
    try {
        const postalOrders = await orderTokens.listAllPostalOrders(); // Make sure this function exists
        res.render('layout', { title: 'Manage Postal Orders', content: 'manage-postal-orders', postalOrders }); // Render the layout with the add-warehouse content
        //res.render('manage-postal-orders', { postalOrders });
    } catch (error) {
        console.error('Error fetching postal orders:', error);
        res.status(500).send('Error fetching postal orders.');
    }
});

// Route to manage product orders
app.get('/product-orders', async (req, res) => {
    try {
        const productOrders = await orderTokens.listAllProductOrders(); // Make sure this function exists
        res.render('layout', { title: 'Manage Product Order', content: 'manage-product-orders' , productOrders});
        //res.render('manage-product-orders', { productOrders });
    } catch (error) {
        console.error('Error fetching product orders:', error);
        res.status(500).send('Error fetching product orders.');
    }
});


//    }
//});
// Update Postal Order Route
app.get('/update-postal-order/:id', async (req, res) => {
    const postal_order_id = req.params.id;
    try {
        const postalOrder = await orderTokens.viewPostalOrder(postal_order_id); // Call the function to get the postal order
        if (postalOrder) {
            res.render('layout', { title: 'Update Postal Order', content: 'update-postal-order', postalOrder });
            //res.render('update-postal-order', { postalOrder }); // Pass the order details to the view
        } else {
            res.status(404).send('Postal order not found.');
        }
    } catch (error) {
        console.error('Error fetching postal order:', error);
        res.status(500).send('Error fetching postal order.');
    }
});


// Handle POST request for updating postal order
app.post('/update-postal-order/:id', async (req, res) => {
    const { order_id, parcel_id, total_price } = req.body;
    const postal_order_id = req.params.id;
    try {
        await orderTokens.updatePostalOrders(order_id, parcel_id, total_price, postal_order_id);
        res.redirect('/postal-orders'); // Redirect to the postal orders management page after update
    } catch (error) {
        console.error('Error updating postal order:', error);
        res.status(500).send('Error updating postal order.');
    }
});
// Delete Postal Order Route
app.post('/delete-postal-order/:id', async (req, res) => {
    const postal_order_id = req.params.id;
    try {
        const result = await deletePostalOrder(postal_order_id); // Ensure you have this function to handle deletion
        if (result) {
            res.redirect('/manage-postal-orders'); // Redirect to postal orders management after deletion
        } else {
            res.status(404).send('Postal order not found.');
        }
    } catch (error) {
        console.error('Error deleting postal order:', error);
        res.status(500).send('Error deleting postal order.');
    }
});


app.get('/manage-product-orders', async (req, res) => {
    try {
        const productOrders = await orderTokens.listAllProductOrders(); // Get all product orders
        res.render('layout', { title: 'Manage Product Order', content: 'manage-product-orders', productOrders});

    } catch (error) {
        console.error('Error fetching product orders:', error);
        res.status(500).send('Error fetching product orders.');
    }
});

// Route to update product order form
app.get('/update-product-order/:id', async (req, res) => {
    const product_id = req.params.id;
    try {
        const [productOrders] = await pool.query("SELECT * FROM product_orders WHERE product_id = ?", [product_id]);
        if (productOrders.length > 0) {
            res.render('layout', { title: 'Update Product Order', content: 'update-product-order', productOrder: productOrders[0]});
        } else {
            res.status(404).send('Product order not found.');
        }
    } catch (error) {
        console.error('Error fetching product order:', error);
        res.status(500).send('Error fetching product order.');
    }
});

// Handle POST request for updating product order
app.post('/update-product-order/:id', async (req, res) => {
    const { order_id, product_id, product_quantity, total_price } = req.body;
    console.log(order_id);
    try {
        await orderTokens.updateProductOrders(order_id, product_id, product_quantity, total_price);
        res.redirect('/manage-product-orders'); // Redirect to the product orders management page after update
    } catch (error) {
        console.error('Error updating product order:', error);
        res.status(500).send('Error updating product order.');
    }
});


// Display the form for adding a new postal order
app.get('/add-postal-order', (req, res) => {
    res.render('layout', { title: 'Add New Postal Order ', content: 'add-postal-order' }); // Render the layout with the add-warehouse content
    //res.render('add-postal-order');
});

// Handle form submission for adding a new postal order
app.post('/add-postal-order', async (req, res) => {
    const { postal_order_id, order_id, parcel_id, total_price } = req.body; // Extract form fields
    try {
        await OrderService.addPostalOrder( order_id, parcel_id); // Add the new postal order to the database
        res.redirect('/postal-orders'); // Redirect back to postal orders list after successful addition
    } catch (error) {
        console.error('Error adding new postal order:', error);
        res.status(500).send('Error adding new postal order.');
    }
});

// Display the form for adding a new product order
app.get('/add-product-order', (req, res) => {
    res.render('layout', { title: 'Add New Product Order', content: 'add-product-order' });
    //res.render('add-product-order');
});
// Handle form submission for adding a new product order
app.post('/add-product-order', async (req, res) => {
    const {  order_id, product_id, product_quantity } = req.body;
    try {
        await OrderService.addProductOrder( order_id, product_id, product_quantity); // Add the new product order
        res.redirect('/product-orders'); // Redirect to product orders management after successful addition
    } catch (error) {
        console.error('Error adding new product order:', error);
        res.status(500).send('Error adding new product order.');
    }
});


// Route to render the "Manage Status and Category" page
app.get('/manage-status-and-category', (req, res) => {
    res.render('layout', { title: 'Manage Status And Category', content: 'manage-status-and-category'});
    //res.render('manage-status-and-category');
});


// Order Status Management
app.get('/manage-order-status', async (req, res) => {
    try {
        const orderStatuses = await StatAndCatService.getOrderStatus();
        res.render('layout', { title: 'Manage Order Status', content: 'manage-order-status', orderStatuses});
        //res.render('manage-order-status', { orderStatuses });
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).send('Error fetching order statuses.');
    }
});


// Return Status Management
app.get('/manage-return-status', async (req, res) => {
    try {
        const returnStatuses = await StatAndCatService.getReturnStatus();
        res.render('layout', { title: 'Manage Return Status', content: 'manage-return-status', returnStatuses });
        //res.render('manage-return-status', { returnStatuses });
    } catch (error) {
        console.error('Error fetching return statuses:', error);
        res.status(500).send('Error fetching return statuses.');
    }
});


// Order Types Management
app.get('/manage-order-types', async (req, res) => {
    try {
        const orderTypes = await statusAndCategoriesManagementToken.getOrderTypes();
        res.render('manage-order-types', { orderTypes });
    } catch (error) {
        console.error('Error fetching order types:', error);
        res.status(500).send('Error fetching order types.');
    }
});



// Route to display the add-order-status form
app.get('/add-order-status', (req, res) => {
    res.render('layout', { title: 'Add New Order Status', content: 'add-order-status' });
    //res.render('add-order-status'); // Renders the form to add new status
});

// Route to handle the form submission for adding a new order status
app.post('/add-order-status', async (req, res) => {
    const { order_status_id, order_status_name } = req.body;
    try {
        await StatAndCatService.addOrderStatus( order_status_name);
        res.redirect('/manage-order-status');
    } catch (error) {
        console.error('Error adding new order status:', error);
        res.status(500).send('Error adding new order status.');
    }
});

// Route to display the update-order-status form
app.get('/update-order-status/:id', async (req, res) => {
    const order_status_id = req.params.id;
    try {
        const orderStatuses = await statusAndCategoriesManagementToken.getOrderStatuses(); // Fetch the specific status
        const orderStatus = orderStatuses.find(status => status.order_status_id === order_status_id);
        if (orderStatus) {
            res.render('layout', { title: 'Update Order Status', content: 'update-order-status', orderStatus });
            //res.render('update-order-status', { orderStatus });
        } else {
            res.status(404).send('Order status not found.');
        }
    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).send('Error fetching order status.');
    }
});

// Route to handle the form submission for updating an existing order status
app.post('/update-order-status/:id', async (req, res) => {
    const { order_status_name } = req.body;
    const order_status_id = req.params.id;
    try {
        await statusAndCategoriesManagementToken.updateOrderStatus(order_status_id, order_status_name);
        res.redirect('/manage-order-status');
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Error updating order status.');
    }
});

// Route to handle the deletion of an order status
app.post('/delete-order-status/:id', async (req, res) => {
    const order_status_id = req.params.id;
    try {
        await StatAndCatService.removeOrderStatus(order_status_id);
        res.redirect('/manage-order-status');
    } catch (error) {
        console.error('Error deleting order status:', error);
        res.status(500).send('Error deleting order status.');
    }
});


// Route to display the add-return-status form
app.get('/add-return-status', (req, res) => {
    res.render('layout', { title: 'Add New Return Status', content: 'add-return-status'});
    //res.render('add-return-status'); // Renders the form to add a new return status
});

// Route to handle the form submission for adding a new return status
app.post('/add-return-status', async (req, res) => {
    const { return_status_id, return_status_name } = req.body;
    try {
        await StatAndCatService.addReturnStatus(return_status_name);
        res.redirect('/manage-return-status');
    } catch (error) {
        console.error('Error adding new return status:', error);
        res.status(500).send('Error adding new return status.');
    }
});

// Route to display the update-return-status form
app.get('/update-return-status/:id', async (req, res) => {
    const return_status_id = req.params.id;
    try {
        const returnStatuses = await statusAndCategoriesManagementToken.getReturnStatuses(); // Fetch return statuses
        const returnStatus = returnStatuses.find(status => status.return_status_id === return_status_id);
        if (returnStatus) {
            res.render('layout', { title: 'Update Return Status', content: 'update-return-status', returnStatus });
            //res.render('update-return-status', { returnStatus });
        } else {
            res.status(404).send('Return status not found.');
        }
    } catch (error) {
        console.error('Error fetching return status:', error);
        res.status(500).send('Error fetching return status.');
    }
});

// Route to handle the form submission for updating an existing return status
app.post('/update-return-status/:id', async (req, res) => {
    const { return_status_name } = req.body;
    const return_status_id = req.params.id;
    try {
        await statusAndCategoriesManagementToken.updateReturnStatus(return_status_id, return_status_name);
        res.redirect('/manage-return-status');
    } catch (error) {
        console.error('Error updating return status:', error);
        res.status(500).send('Error updating return status.');
    }
});

// Route to handle the deletion of a return status
app.post('/delete-return-status/:id', async (req, res) => {
    const return_status_id = req.params.id;
    try {
        await StatAndCatService.removeReturnStatus(return_status_id);
        res.redirect('/manage-return-status');
    } catch (error) {
        console.error('Error deleting return status:', error);
        res.status(500).send('Error deleting return status.');
    }
});

//WAREHOUSE TYPES
// Route to display the manage-warehouse-types page
app.get('/manage-warehouse-types', async (req, res) => {
    try {
        const warehouseTypes = await StatAndCatService.getWarehouseTypes(); // Fetch warehouse types
        res.render('layout', { title: 'Manage Warehouse Types', content: 'manage-warehouse-types', warehouseTypes });
        //res.render('manage-warehouse-types', { warehouseTypes });
    } catch (error) {
        console.error('Error fetching warehouse types:', error);
        res.status(500).send('Error fetching warehouse types.');
    }
});

// Route to display the add-warehouse-type form
app.get('/add-warehouse-type', (req, res) => {
    res.render('layout', { title: 'Add New Warehouse Type', content: 'add-warehouse-type' });
    //res.render('add-warehouse-type'); // Render the form to add a new warehouse type
});

// Route to handle the form submission for adding a new warehouse type
app.post('/add-warehouse-type', async (req, res) => {
    const { warehouse_type_name } = req.body;
    try {
        await StatAndCatService.addWarehouseType( warehouse_type_name);
        res.redirect('/manage-warehouse-types');
    } catch (error) {
        console.error('Error adding warehouse type:', error);
        res.status(500).send('Error adding warehouse type.');
    }
});

// Route to display the update-warehouse-type form
app.get('/update-warehouse-type/:id', async (req, res) => {
    const warehouse_type_id = req.params.id;
    try {
        const warehouseTypes = await statusAndCategoriesManagementToken.getWarehouseTypes();
        const warehouseType = warehouseTypes.find(type => type.warehouse_type_id === warehouse_type_id);
        if (warehouseType) {
            res.render('layout', { title: 'Update Warehouse Type', content: 'update-warehouse-type', warehouseType });
            //res.render('update-warehouse-type', { warehouseType });
        } else {
            res.status(404).send('Warehouse type not found.');
        }
    } catch (error) {
        console.error('Error fetching warehouse type:', error);
        res.status(500).send('Error fetching warehouse type.');
    }
});

// Route to handle the form submission for updating a warehouse type
app.post('/update-warehouse-type/:id', async (req, res) => {
    const { warehouse_type_name } = req.body;
    const warehouse_type_id = req.params.id;
    try {
        await statusAndCategoriesManagementToken.updateWarehouseType(warehouse_type_id, warehouse_type_name);
        res.redirect('/manage-warehouse-types');
    } catch (error) {
        console.error('Error updating warehouse type:', error);
        res.status(500).send('Error updating warehouse type.');
    }
});

// Route to handle the deletion of a warehouse type
app.post('/delete-warehouse-type/:id', async (req, res) => {
    const warehouse_type_id = req.params.id;
    try {
        await StatAndCatService.removeWarehouseType(warehouse_type_id);
        res.redirect('/manage-warehouse-types');
    } catch (error) {
        console.error('Error deleting warehouse type:', error);
        res.status(500).send('Error deleting warehouse type.');
    }
});

//PRODUCT CATEGORIES


// Add routes to manage product categories

// GET route to display all product categories
app.get('/manage-product-categories', async (req, res) => {
    try {
        const productCategories = await StatAndCatService.getProductCategories(); // Fetch product categories
        res.render('layout', { title: 'Manage Product Categories', content: 'manage-product-categories', productCategories });
        //res.render('manage-product-categories', { productCategories });
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).send('Error fetching product categories.');
    }
});

// Route to display the form to add a new product category
app.get('/add-product-category', (req, res) => {
    res.render('layout', { title: 'Add Product Category', content: 'add-product-category' });
    //res.render('add-product-category'); // Render the EJS file for adding product categories
});


// POST route to add a new product category
app.post('/add-product-category', async (req, res) => {
    const { product_category_id, product_category_name } = req.body;
    try {
        await StatAndCatService.addProductCategory( product_category_name); // Insert product category
        res.redirect('/manage-product-categories');
    } catch (error) {
        console.error('Error adding product category:', error);
        res.status(500).send('Error adding product category.');
    }
});
// Route to display the form to update a product category
app.get('/update-product-category/:id', async (req, res) => {
    const productCategoryId = req.params.id;
    try {
        // Fetch the existing product category using the provided ID
        const [rows] = await pool.query("SELECT * FROM product_categories WHERE product_category_id = ?", [productCategoryId]);
        if (rows.length > 0) {
            res.render('layout', { title: 'Update Product Category', content: 'update-product-category', productCategory: rows[0] });
            //res.render('update-product-category', { productCategory: rows[0] }); // Pass the current category details to the view
        } else {
            res.status(404).send('Product category not found.');
        }
    } catch (error) {
        console.error('Error fetching product category:', error);
        res.status(500).send('Error fetching product category.');
    }
});


// POST route to update an existing product category
app.post('/update-product-category/:id', async (req, res) => {
    const { product_category_name } = req.body;
    const product_category_id = req.params.id;
    try {
        await statusAndCategoriesManagementToken.updateProductCategory(product_category_id, product_category_name); // Update product category
        res.redirect('/manage-product-categories');
    } catch (error) {
        console.error('Error updating product category:', error);
        res.status(500).send('Error updating product category.');
    }
});

// POST route to delete a product category
app.post('/delete-product-category/:id', async (req, res) => {
    const product_category_id = req.params.id;
    try {
        await StatAndCatService.removeProductCategory(product_category_id); // Delete product category
        res.redirect('/manage-product-categories');
    } catch (error) {
        console.error('Error deleting product category:', error);
        res.status(500).send('Error deleting product category.');
    }
});


//MANAGE PARCEL -----------------------------------
// Display all parcel categories
app.get('/manage-parcel-categories', async (req, res) => {
    try {
        const parcelCategories = await StatAndCatService.getParcelCategories();
        res.render('layout', { title: 'Manage Parcel Categoeies', content: 'manage-parcel-categories', parcelCategories });
        //res.render('manage-parcel-categories', { parcelCategories });
    } catch (error) {
        console.error('Error fetching parcel categories:', error);
        res.status(500).send('Error fetching parcel categories.');
    }
});

// Display the form to add a new parcel category
app.get('/add-parcel-category', (req, res) => {
    res.render('layout', { title: 'Add new Parcel Category ', content: 'add-parcel-category' });
    //res.render('add-parcel-category');
});

// Handle the form submission to add a new parcel category
app.post('/add-parcel-category', async (req, res) => {
    const { parcel_category_name } = req.body;
    try {
        const result = await StatAndCatService.addParcelCategory(parcel_category_name);
        if (result) {
            res.redirect('/manage-parcel-categories');
        } else {
            res.status(500).send('Error adding parcel category.');
        }
    } catch (error) {
        console.error('Error adding parcel category:', error);
        res.status(500).send('Error adding parcel category.');
    }
});

// Display the form to update a parcel category
app.get('/update-parcel-category/:id', async (req, res) => {
    const parcelCategoryId = req.params.id; 
    console.log(parcelCategoryId);
    try {
        const [rows] = await pool.query("SELECT * FROM parcel_categories WHERE parcel_category_id = ?",[parcelCategoryId]);
        if (rows.length > 0) {
            res.render('layout', { title: 'Update Parcel Category ', content: 'update-parcel-category', parcelCategory: rows[0] });
            //res.render('update-parcel-category', { parcelCategory });
        } else {
            res.status(404).send('Parcel category not found.');
        }
    } catch (error) {
        console.error('Error fetching parcel category:', error);
        res.status(500).send('Error fetching parcel category.');
    }
});

// Handle the form submission to update a parcel category
app.post('/update-parcel-category/:id', async (req, res) => {
    const { parcel_category_name } = req.body;
    const parcelCategoryId = req.params.id;

    try {
        await statusAndCategoriesManagementToken.updateParcelCategory(parcelCategoryId, parcel_category_name);
        res.redirect('/manage-parcel-categories'); // Redirect after successful update
    } catch (error) {
        console.error('Error updating parcel category:', error);
        res.status(500).send('Error updating parcel category.');
    }
});

// Handle the request to delete a parcel category
app.post('/delete-parcel-category/:id', async (req, res) => {
    const parcelCategoryId = req.params.id;
    try {
        const result = await StatAndCatService.removeParcelCategory(parcelCategoryId);
        if (result) {
            res.redirect('/manage-parcel-categories');
        } else{
            res.redirect('/manage-parcel-categories');

        }
    } catch (error) {
        console.error('Error deleting parcel category:', error);
        res.status(500).send('Error deleting parcel category.');
    }
});
    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });


//warehouse logs
app.get('/warehouse-logs', async (req, res) => {
    try {
        const logs = await LogService.getWarehouseLogs();
        res.render('layout', { title: 'Warehouse Logs ', content: 'warehouse-logs', logs });
    } catch (error) {
        res.status(500).send('Error fetching warehouse logs');
    }
});

//warehouse archives
app.get('/warehouse-archives', async (req, res) => {
    try {
        const archives = await ArchiveService.getWarehouseArchives();
        res.render('layout', { title: 'Warehouse Archives ', content: 'warehouse-archives', archives });
    } catch (error) {
        res.status(500).send('Error fetching warehouse archives');
    }
});

//shipment logs
app.get('/shipment-logs', async (req, res) => {
    try {
        const shipmentLogs = await LogService.getShipmentLogs();
        res.render('layout', { title: 'Shipment Logs ', content: 'shipment-logs', shipmentLogs });
    } catch (error) {
        res.status(500).send('Error fetching shipment logs');
    }
});

//shipment archives
app.get('/shipment-archives', async (req, res) => {
    try {
        const shipmentArchives = await ArchiveService.getShipmentArchives();
        res.render('layout', { title: 'Shipment Archives ', content: 'shipment-archives', shipmentArchives });
    } catch (error) {
        res.status(500).send('Error fetching shipment archives');
    }
});

//customer logs
app.get('/customer-logs', async (req, res) => {
    try {
        const customerLogs = await LogService.getCustomerLogs();
        res.render('layout', { title: 'Customer Logs ', content: 'customer-logs', customerLogs });
    } catch (error) {
        res.status(500).send('Error fetching customer logs');
    }
});

//customer archives
app.get('/customer-archives', async (req, res) => {
    try {
        const customerArchives = await ArchiveService.getCustomerArchives();
        res.render('layout', { title: 'Customer Archives ', content: 'customer-archives', customerArchives });
    } catch (error) {
        res.status(500).send('Error fetching customer archives');
    }
});

//employee logs
app.get('/employee-logs', async (req, res) => {
    try {
        const employeeLogs = await LogService.getEmployeeLogs();
        res.render('layout', { title: 'Employee Logs ', content: 'employee-logs', employeeLogs });
    } catch (error) {
        res.status(500).send('Error fetching customer logs');
    }
});

//employee archives
app.get('/employee-archives', async (req, res) => {
    try {
        const employeeArchives = await ArchiveService.getEmployeeArchives();
        res.render('layout', { title: 'Employee Archives', content: 'employee-archives', employeeArchives });
    } catch (error) {
        res.status(500).send('Error fetching customer archives');
    }
});

//get all returns
app.get('/returns', async (req, res) => {
    try {
        const returns = await ReturnService.getAllReturns();
        res.render('layout', { title: 'Returns', content: 'returns', returns });
    } catch (error) {
        res.status(500).send('Error fetching returns');
    }
});
// return logs
app.get('/return-logs', async (req, res) => {
    try {
        const returnLogs = await LogService.getReturnLogs();
        res.render('layout', { title: 'Return Logs ', content: 'return-logs', returnLogs });
    } catch (error) {
        res.status(500).send('Error fetching customer logs');
    }
});

// GET: Show form to add a new order
app.get('/add-orders', async (req, res) => {
    try {
        const [shippingServices] = await pool.query('SELECT shipping_service_id, shipping_service_name FROM shipping_services'); // Fetch all shipping services
        res.render('layout', { title: 'Add New Order', content: 'add-orders', shippingServices }); // Pass shipping services to the template
    } catch (error) {
        console.error('Error fetching shipping services:', error);
        res.status(500).send('Error fetching shipping services.');
    }
});

// Route to handle form submission
app.post('/add-orders', async (req, res) => {
    const {customer_id, shipping_service_id, shipping_address, shipping_receiver} = req.body;
    const success = await OrderService.addOrder(customer_id, shipping_service_id, shipping_address, shipping_receiver);

    if (success) {
        res.redirect('/orders'); // Redirect to the orders page or wherever you want
    } else {
        res.status(500).send('Error adding order'); // Handle error response
    }
});

// parcel inventory logs
app.get('/parcel-inventory-logs', async (req, res) => {
    try {
        const logs = await LogService.getParcelInventoryLogs();
        res.render('layout', { title: 'Parcel Inventory Logs ', content: 'parcel-inventory-logs', logs });
    } catch (error) {
        res.status(500).send('Error fetching customer logs');
    }
});

//parcel archives
app.get('/parcel-archives', async (req, res) => {
    try {
        const archives = await ArchiveService.getParcelArchives();
        res.render('layout', { title: 'Parcel Archives ', content: 'parcel-archives', archives });
    } catch (error) {
        res.status(500).send('Error fetching customer archives');
    }
});


// product inventory logs
app.get('/product-inventory-logs', async (req, res) => {
    try {
        const inventoryLogs = await LogService.getProductInventoryLogs();
        res.render('layout', { title: 'Product Inventory Logs ', content: 'product-inventory-logs', inventoryLogs });
    } catch (error) {
        res.status(500).send('Error fetching customer logs');
    }
});

//product archives
app.get('/product-archives', async (req, res) => {
    try {
        const productArchives = await ArchiveService.getProductArchives();
        res.render('layout', { title: 'Product Archives ', content: 'product-archives', productArchives });
    } catch (error) {
        res.status(500).send('Error fetching customer archives');
    }
});


//order logs

app.get('/order-logs', async (req, res) => {
    try {
        const orderLogs = await LogService.getOrderLogs();
        res.render('layout', { title: 'Orders Logs ', content: 'order-logs', orderLogs });
    } catch (error) {
        res.status(500).send('Error fetching customer logs');
    }
});

//order archives
app.get('/order-archives', async (req, res) => {
    try {
        const orderArchives = await ArchiveService.getOrderArchives();
        res.render('layout', { title: 'Orders Archives ', content: 'order-archives', orderArchives });
    } catch (error) {
        res.status(500).send('Error fetching customer archives');
    }
});

app.get('/manage-employee/:id', async (req, res) => {
    const employeeId = req.params.id; // Get the employee ID from the route parameter

    try {
        // Fetch the specific employee by ID
        const [employee] = await pool.query('SELECT employee_id, warehouse_id FROM warehouse_employees WHERE employee_id = ?', [employeeId]);

        // Fetch all available warehouses
        const [warehouses] = await pool.query('SELECT warehouse_id FROM warehouses');

        // Check if the employee exists
        if (employee.length === 0) {
            return res.render('layout', { title: 'Manage Employee', content: 'manage-employee', employees: [], warehouses: [], message: `Employee with ID ${employeeId} not found.` });
        }

        // Check if the employee is not assigned to any warehouse (warehouse_id is null or undefined)
        if (!employee[0].warehouse_id) {
            return res.render('layout', { title: 'Manage Employee', content: 'manage-employee', employees: employee, warehouses, message: `Employee ${employeeId} is not assigned to any warehouse.` });
        }

        // Render the manage-employee page if everything is fine
        res.render('layout', { title: 'Manage Employee', content: 'manage-employee', employees: employee, warehouses, message: null });
    } catch (error) {
        console.error('Error fetching employee or warehouses:', error);
        res.render('layout', { title: 'Manage Employee', content: 'manage-employee', employees: [], warehouses: [], message: 'An error occurred while fetching employee data.' });
    }
});



// POST route to handle transferring an employee to another warehouse
app.post('/transfer', async (req, res) => {
    const { employee_id, current_warehouse_id, new_warehouse_id } = req.body;

    const success = await EmployeeService.updateEmployeeWarehouse(current_warehouse_id, new_warehouse_id, employee_id);
    const message = success
        ? `Employee ${employee_id} successfully transferred to warehouse ${new_warehouse_id}.`
        : `Failed to transfer employee ${employee_id}.`;

    res.redirect(`/employees`);
});

// POST route to handle removing an employee from a warehouse
app.post('/remove', async (req, res) => {
    const { employee_id, warehouse_id } = req.body;

    const success = await EmployeeService.removeEmployeeFromWarehouse(warehouse_id, employee_id);
    const message = success
        ? `Employee ${employee_id} successfully removed from warehouse ${warehouse_id}.`
        : `Failed to remove employee ${employee_id}.`;

    res.redirect(`/employees`);
});

// GET route to render the form for adding a return
app.get('/add-return', (req, res) => {
    res.render('layout', { title: 'Add Retrun', content: 'add-return'});

});
// POST route to handle the form submission and add a return
app.post('/add-return', async (req, res) => {
    const { order_id, return_reason, return_date } = req.body; // Destructure form inputs from the request body

    try {
        // Call the addReturn function to insert the new return entry
        const success = await ReturnService.addReturn(order_id, return_reason, return_date);

        res.redirect('/returns')
    } catch (error) {
        console.error('Error processing return:', error);

        // If an error occurs, render the form with an error message
        res.render('layout', { title: 'Add Retrun', content: 'add-return'});
    }
});

app.get('/return/:id', async (req, res) => {
    const { id } = req.params; // Extract employee ID from the route parameters
    try {
        const returnDetails = await ReturnService.viewReturn(id); // Fetch employee details by ID
        if (returnDetails) {
            res.render('layout', { title: 'View Return', content: 'view-return', returnDetails }); // Render the layout with the add-warehouse content
            //res.render('view-employee', { employee }); // Render the employee details page
        } else {
            res.status(404).send('Return not found.');
        }
    } catch (error) {
        console.error('Error fetching return:', error);
        res.status(500).send('Error fetching return.');
    }
});

// GET route to render the update return status form
// GET route to display the update return form
app.get('/update-return/:id', async (req, res) => {
    const returnId = req.params.id;

    try {
        // Fetch return data by ID
        const returnData = await ReturnService.viewReturn(returnId);
        // Fetch all status names
        const statusList = await StatAndCatService.getReturnStatus(); // Adjust this according to your service method

        if (!returnData) {
            return res.render('layout', { 
                title: 'Update Return Status', 
                content: 'update-return', 
                message: `Return with ID ${returnId} not found.` 
            });
        }

        // Render the form with return data and status list
        res.render('layout', { 
            title: 'Update Return Status', 
            content: 'update-return', 
            returnData, 
            statusList // Pass the status list to the EJS template
        });
    } catch (error) {
        console.error('Error fetching return data:', error);
        res.render('layout', { 
            title: 'Update Return Status', 
            content: 'update-return', 
            message: 'An error occurred while fetching the return data.' 
        });
    }
});



// POST route to update return status
// POST route to handle updating the return status
app.post('/update-return-status', async (req, res) => {
    const { return_id, new_status_id } = req.body;

    try {
        // Call function to update the return status
        await ReturnService.updateReturnStatus(return_id, new_status_id);

        res.redirect(`/returns`);
    } catch (error) {
        console.error('Error updating return status:', error);

        // In case of error, show the error message
        res.redirect(`/update-return/${return_id}?message=${encodeURIComponent('An error occurred while updating the status.')}`);
    }
});


app.get('/manage-shipment-status', async (req, res) => {
    const shipmentStatuses = await StatAndCatService.getShipmentStatus();
    res.render('layout', { title: 'Manage Shipment Status', content: 'manage-shipment-status', shipmentStatuses }); // Render the layout with the add-warehouse content
});
app.get('/add-shipment-status', async (req, res) => {
    res.render('layout', { title: 'Add Shipment Status', content: 'add-shipment-status' }); // Render the layout with the add-warehouse content
});



app.post('/add-shipment-status', async (req, res) => {
    const { shipment_status_name } = req.body;
    const success = await StatAndCatService.addShipmentStatus(shipment_status_name);

    if (success) {
        res.redirect('/manage-shipment-status');
    } else {
        res.status(500).send('Failed to add shipment status');
    }
});

app.post('/shipment-status/remove/:id', async (req, res) => {
    const shipment_status_id = req.params.id;
    const success = await StatAndCatService.removeShipmentStatus(shipment_status_id);

    if (success) {
        res.redirect('/manage-shipment-status');
    } else {
        res.status(500).send(`Failed to remove shipment status ${shipment_status_id}. It might be in use.`);
    }
});
app.get('/delete-product-order/:id', async (req, res) => {
    res.render('layout', { title: 'Add Shipment Status', content: 'add-shipment-status' }); // Render the layout with the add-warehouse content
});

app.post('/delete-product-order', async (req, res) => {
    const { order_id, product_id } = req.body;

    // Check if both order_id and product_id are provided
    if (!order_id || !product_id) {
        return res.status(400).json({ message: 'Unassigned product to order.' });
    }

    try {
        // Call the removeProductOrder function
        const success = await removeProductOrder(order_id, product_id);

        if (success) {
            return res.status(200).json({ message: 'Product successfully unassigned from order.' });
        } else {
            return res.status(404).json({ message: 'No matching product order found to remove.' });
        }
    } catch (error) {
        console.error('Error in /remove-product-order:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
app.post('/delete-customer/:id', async (req, res) => {
    const {customer_id } = req.params.id;
    const success = await CustomerService.removeCustomer(customer_id);

    if (success) {
        res.redirect('/customers');
    } else {
        res.status(500).send(`Failed to remove shipment status ${shipment_status_id}. It might be in use.`);
    }
});

app.get('/update-shipment-status/:id', async (req, res) => {
    const shipment_status_id = req.params.id;
    try {
        const [rows] = await pool.query("SELECT * FROM shipment_status WHERE shipment_status_id = ?",[shipment_status_id]);
        if (rows.length > 0) {
            res.render('layout', { title: 'Update Shipment ', content: 'edit-shipment-status', shipmentStatus: rows[0] });
            //res.render('update-parcel-category', { parcelCategory });
        } else {
            res.status(404).send('Parcel category not found.');
        }
    } catch (error) {
        console.error('Error fetching parcel category:', error);
        res.status(500).send('Error fetching parcel category.');
    }
});

// POST route to handle the form submission for updating shipment status
app.post('/update-shipment-status/:id', async (req, res) => {
    const shipment_status_id = req.params.id;
    const { shipment_status_name } = req.body;


    try {
        await StatAndCatService.updateShipmentStatus(shipment_status_id, shipment_status_name);
        res.redirect('/manage-shipment-status'); // Redirect after successful update
    } catch (error) {
        console.error('Error updating parcel category:', error);
        res.status(500).send('Error updating parcel category.');
    }
});

app.post('/delete-postal-order', async (req, res) => {
    const { order_id, parcel_id } = req.body;

    // Check if both order_id and parcel_id are provided
    if (!order_id || !parcel_id) {
        return res.status(400).json({ message: 'Unassigned parcel to order' });
    }

    try {
        // Call the removePostalOrder function
        const success = await OrderService.removePostalOrder(order_id, parcel_id);

        if (success) {
            return res.status(200).json({ message: 'Parcel successfully unassigned from order.' });
        } else {
            return res.status(404).json({ message: 'No matching postal order found to remove.' });
        }
    } catch (error) {
        console.error('Error in /remove-postal-order:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/order-options/:order_id', async (req, res) => {
    const { order_id } = req.params; // Get the order_id from the URL parameters

    try {
        // Fetch order details from the database
        const [order] = await pool.query(`SELECT * FROM orders WHERE order_id = ?`, [order_id]);

        if (order.length === 0) {
            return res.status(404).send(`Order ${order_id} not found.`);
        }

        // Fetch all current carriers
        const [carriers] = await pool.query(`SELECT * FROM carriers`); // Adjust the query based on your database schema

        // Render the layout with order and carrier data
        res.render('layout', {
            title: 'Order Options',
            content: 'order-options',
            orders: order[0],
            carriers: carriers // Pass the carriers to the EJS template
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/ship-order/:order_id', async (req, res) => {
    const { order_id } = req.params; // Get the order_id from the URL parameters
    const { carrier_id } = req.body; // Get the carrier_id from the request body

    try {
        // Call the shipOrder function with the extracted order_id and carrier_id
        const shipmentSuccess = await OrderService.shipOrder(order_id, carrier_id);

        if (shipmentSuccess) {
            // Redirect to orders page or display success message
            res.redirect('/orders'); // Adjust this route as needed
        } else {
            // Handle failure in shipment creation
            res.status(400).send(`Failed to ship order ${order_id}. Please try again.`);
        }
    } catch (error) {
        console.error('Error shipping order:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET route to display the update order status form
// GET route to display the update order status form
app.get('/edit-order-status/:order_id', async (req, res) => {
    const { order_id } = req.params; // Get the order_id from the URL parameters

    try {
        // Fetch order details from the database
        const [order] = await pool.query(`SELECT * FROM orders WHERE order_id = ?`, [order_id]);

        if (order.length === 0) {
            return res.status(404).send(`Order ${order_id} not found.`);
        }

        // Fetch all order statuses from the database
        const [statuses] = await pool.query(`SELECT * FROM order_status`);

        res.render('layout', {
            title: 'Update Order Status',
            content: 'edit-order-status',
            order: order[0],
            statuses: statuses // Pass the statuses to the template
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Internal Server Error');
    }
});


// POST route to update the order status
app.post('/edit-order-status/:order_id', async (req, res) => {
    const { order_id } = req.params; // Get the order_id from the URL parameters
    const { new_order_status_id } = req.body; // Get the new order status from the request body

    try {
        const updateSuccess = await OrderService.updateOrderStatus(order_id, new_order_status_id);

        if (updateSuccess) {
            // Redirect to the order options page or display success message
            res.redirect('/orders'); // Adjust this route as needed
        } else {
            // Handle failure in updating order status
            res.status(400).send(`Failed to update status for order ${order_id}. Please try again.`);
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST route to remove an order
app.post('/remove-order/:order_id', async (req, res) => {
    const { order_id } = req.params; // Get order_id from URL parameters

    const success = await OrderService.removeOrder(order_id); // Call the removeOrder function
    if (success) {
        res.redirect('/orders'); // Redirect to orders page if successful
    } else {
        res.status(500).send('Error removing order'); // Send error response if removal failed
    }
});

// POST route to cancel an order
app.post('/cancel-order/:order_id', async (req, res) => {
    const { order_id } = req.params; // Get order_id from URL parameters

    const success = await OrderService.cancelOrder(order_id); // Call the cancelOrder function
    if (success) {
        res.redirect('/orders'); // Redirect to orders page if successful
    } else {
        res.status(500).send('Error canceling order'); // Send error response if cancellation failed
    }
});
