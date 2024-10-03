    import path from 'path';
    import { fileURLToPath } from 'url';
    import pool from "./DBConnection.js";
    import express from 'express';
    import employeeManagementToken from './EmployeeManagement.js';
    import warehouseManagementToken from './WarehouseManagement.js';
    import productManagementToken from './ProductManagement.js';
    import parcelManagementToken from './ParcelManagement.js';
    import customerManagementToken from './CustomerManagement.js';
    import shipmentManagementToken from './ShipmentManagement.js';
    import carrierPartnerTokens from './CarrierPartnerManagement.js';
    import orderTokens from './OrderManagement.js';
    import statusAndCategoriesManagementToken from './StatusAndCategoriesManagement.js';

    // Get __filename and __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Initialize Express
    const app = express();
    const port = 3003;
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


// Route to display the Add Employee form
app.get('/add-employee', (req, res) => {
    res.render('add-employee');  // Render the add-employee.ejs form
});

// Route to handle form submission for adding a new employee
app.post('/add-employee', async (req, res) => {
    const { employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary } = req.body; // Extract form fields
    try {
        await employeeManagementToken.addEmployee(employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary); // Add the new employee
        res.redirect('/employees'); // Redirect to employee list after successful addition
    } catch (error) {
        console.error('Error adding new employee:', error);
        res.status(500).send('Error adding new employee.');
    }
});
// GET: List all job roles
app.get('/manage-job-roles', async (req, res) => {
    try {
        const jobRoles = await employeeManagementToken.listAllJobRoles(); // Fetch job roles from the database
        res.render('manage-job-roles', { jobRoles }); // Render the view and pass job roles
    } catch (error) {
        console.error('Error fetching job roles:', error);
        res.status(500).send('Error fetching job roles.');
    }
});

// GET: Show form to add a new job role
app.get('/add-job-role', (req, res) => {
    res.render('add-job-role'); // Render the form to add a new job role
});

// POST: Add a new job role
app.post('/add-job-role', async (req, res) => {
    const { employee_role_id, role_name } = req.body; // Extract form fields
    try {
        await employeeManagementToken.addJobRole(employee_role_id, role_name); // Add the new job role
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
        const jobRole = await employeeManagementToken.viewJobRole(id); // Fetch the job role by ID
        if (jobRole) {
            res.render('update-job-role', { jobRole }); // Render the update form with the job role details
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
        await employeeManagementToken.updateJobRole(id, role_name); // Update the job role
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
        await employeeManagementToken.removeJobRole(id); // Remove the job role
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
        await employeeManagementToken.addJobRole(employee_role_id, role_name); // Add the new job role
        res.redirect('/employees'); // Redirect to employee list after successful addition
    } catch (error) {
        console.error('Error adding new job role:', error);
        res.status(500).send('Error adding new job role.');
    }
});


    // Employee route
    app.get('/employees', async (req, res) => {
        try {
            const employees = await employeeManagementToken.listAllEmployees();
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
            const employee = await employeeManagementToken.viewEmployee(id); // Fetch employee details by ID
            if (employee) {
                res.render('view-employee', { employee }); // Render the employee details page
            } else {
                res.status(404).send('Employee not found.');
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).send('Error fetching employee.');
        }
    });
    



 // Route for updating an employee (form rendering)
app.get('/update-employee/:id', async (req, res) => {
    const { id } = req.params; // Extract employee ID from the route parameters
    try {
        const employee = await employeeManagementToken.viewEmployee(id); // Fetch employee details by ID
        if (employee) {
            res.render('update-employee', { employee }); // Render the update form
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
    console.log('Updating employee:', { id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary });

    try {
        // Call your management token to update employee details
        const updated = await employeeManagementToken.updateEmployee(employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary, id);
        
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
            await employeeManagementToken.deleteEmployee(req.params.id);
            res.redirect('/employees'); // Redirect back to the employee list after deletion
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).send('Error deleting employee.');
        }
    });

    // Warehouse route
    app.get('/warehouses', async (req, res) => {
        try {
            const warehouses = await warehouseManagementToken.listAllWarehouse(); // Correct the variable name
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
    app.get('/add-warehouse', (req, res) => {
        res.render('add-warehouse'); // Render the form for adding a new warehouse
    });
    

 // Handle form submission for adding a new warehouse
app.post('/add-warehouse', async (req, res) => {
    const { warehouse_id, warehouse_address, capacity, warehouse_type_id } = req.body; // Extract the form fields
    try {
        // Log the inputs to debug
        console.log('Adding warehouse:', { warehouse_id, warehouse_address, capacity, warehouse_type_id });

        await warehouseManagementToken.addWarehouse(warehouse_id, warehouse_address, capacity, warehouse_type_id);
        res.redirect('/warehouses'); // Redirect to the warehouse list after adding
    } catch (error) {
        console.error('Error adding warehouse:', error);
        res.status(500).send('Error adding warehouse.');
    }
});

    
    // Route to render form for updating a warehouse
app.get('/update-warehouse/:id', async (req, res) => {
    const { id } = req.params; // Extract warehouse ID from the route parameters
    try {
        const warehouse = await warehouseManagementToken.findWarehouseById(id); // Fetch warehouse details by ID
        if (warehouse) {
            res.render('update-warehouse', { warehouse }); // Render the update form with the warehouse details
        } else {
            res.status(404).send('Warehouse not found.');
        }
    } catch (error) {
        console.error('Error fetching warehouse for update:', error);
        res.status(500).send('Error fetching warehouse.');
    }
});

// Handle form submission for updating a warehouse
app.post('/update-warehouse/:id', async (req, res) => {
    const { id } = req.params; // Extract warehouse ID from the route parameters
    const { warehouse_address, capacity, warehouse_type_id } = req.body; // Extract all necessary fields from the form
    try {
        await warehouseManagementToken.updateWarehouseDetails(id, warehouse_address, capacity, warehouse_type_id); // Call the function to update the warehouse
        res.redirect('/warehouses'); // Redirect to the warehouse list after updating
    } catch (error) {
        console.error('Error updating warehouse:', error);
        res.status(500).send('Error updating warehouse.');
    }
});

// Route to check warehouse availability
app.get('/check-availability', async (req, res) => {
    try {
        const warehouses = await warehouseManagementToken.listAllWarehouse(); // Get the list of all warehouses
        const warehouseAvailability = [];

        // Check availability for each warehouse
        for (const warehouse of warehouses) {
            const isAvailable = await warehouseManagementToken.checkWarehouseAvailability(warehouse.warehouse_id);
            warehouseAvailability.push({
                ...warehouse,
                isAvailable: isAvailable ? 'Available' : 'Full'
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


app.get('/inventory', (req, res) => {
    res.render('manage-inventory', {
        title: 'Manage Inventory',
        content: 'manage-inventory'
    });
});

app.get('/parcel', async (req, res) => {
    try {
        const parcels = await parcelManagementToken.listAllParcel(); // Assuming this function exists
        res.render('parcel', {
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
        const products = await productManagementToken.listAllProduct(); // Assuming this function exists
        res.render('product', {
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
            const parcels = await parcelManagementToken.listAllParcel(); // Fetch parcel inventory
            const products = await productManagementToken.listAllProduct(); // Fetch product inventory
            res.render('layout', {
                title: 'Inventories',
                content: 'inventories', // Assuming you will create inventories.ejs
                parcels,
                products
            });
        } catch (error) {
            console.error('Error fetching inventories:', error);
            res.status(500).send('Error fetching inventories.');
        }
    });

    // Route for adding a new parcel (form rendering)
    app.get('/add-parcel', (req, res) => {
        res.render('add-parcel'); // Render the form for adding a new parcel
    });

    // Handle the form submission for adding a new parcel
    // Example handler for adding a parcel category
app.post('/add-parcel-category', async (req, res) => {
    console.log(req.body);
    const { parcel_category_id, parcel_category_name } = req.body; // Ensure these values are being captured

    try {
        // Log the values to see what's being passed
        console.log('Adding Parcel Category:', parcel_category_id, parcel_category_name);
        
        const result = await statusAndCategoriesManagementToken.insertParcelCategory(parcel_category_id, parcel_category_name);
        if (result) {
            res.redirect('/manage-parcel-categories'); // Redirect after successful addition
        } else {
            res.status(400).send('Failed to add parcel category.');
        }
    } catch (error) {
        console.error('Error adding parcel category:', error);
        res.status(500).send('Error adding parcel category.');
    }
});


    // Route for editing a parcel (render form with existing data)
    app.get('/edit-parcel/:id', async (req, res) => {
        const parcel_id = req.params.id; // Extract parcel ID from the route parameters
        try {
            const parcel = await parcelManagementToken.findParcel(parcel_id); // Fetch parcel details
            if (parcel) {
                res.render('edit-parcel', { parcel }); // Render the edit form with parcel data
            } else {
                res.status(404).send('Parcel not found.');
            }
        } catch (error) {
            res.status(500).send('Error retrieving parcel for editing.');
        }
    });

    // Handle the form submission for updating a parcel
    app.post('/edit-parcel/:id', async (req, res) => {
        const parcel_id = req.params.id; // Extract parcel ID from the route parameters
        const { parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive } = req.body;
        try {
            await parcelManagementToken.updateParcel(parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_returnable, is_temperature_sensitive, parcel_id);
            res.redirect('/parcel'); // Redirect to the home page after updating
        } catch (error) {
            res.status(500).send('Error updating parcel.');
        }
    });

    // Route for deleting a parcel
    app.post('/delete-parcel/:id', async (req, res) => {
        const parcel_id = req.params.id; // Extract parcel ID from the route parameters
        try {
            await parcelManagementToken.deleteParcel(parcel_id); // Call the delete function
            res.redirect('/parcel'); // Redirect to the home page after deletion
        } catch (error) {
            res.status(500).send('Error deleting parcel.');
        }
    });

    app.get('/add-product', (req, res) => {
        res.render('add-product'); // Render the form for adding a new product
    });

    // Handle the form submission for adding a new product
    app.post('/add-product', async (req, res) => {
        const { product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive } = req.body;
        try {
            await productManagementToken.insertProduct(product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive);
            res.redirect('/product'); // Redirect to the home page after adding
        } catch (error) {
            res.status(500).send('Error adding product.');
        }
    });

    // Route for editing a product (render form with existing data)
    app.get('/edit-product/:id', async (req, res) => {
        const product_id = req.params.id; // Extract product ID from the route parameters
        try {
            const product = await productManagementToken.findProduct(product_id); // Fetch product details
            if (product) {
                res.render('edit-product', { product }); // Render the edit form with product data
            } else {
                res.status(404).send('Product not found.');
            }
        } catch (error) {
            res.status(500).send('Error retrieving product for editing.');
        }
    });

    // Handle the form submission for updating a product
    app.post('/edit-product/:id', async (req, res) => {
        const product_id = req.params.id; // Extract product ID from the route parameters
        const { product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive } = req.body;
        try {
            await productManagementToken.updateProduct(product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive, product_id);
            res.redirect('/product'); // Redirect to the home page after updating
        } catch (error) {
            res.status(500).send('Error updating product.');
        }
    });

    // Route for deleting a product
    app.post('/delete-product/:id', async (req, res) => {
        const product_id = req.params.id; // Extract product ID from the route parameters
        try {
            await productManagementToken.deleteProduct(product_id); // Call the delete function
            res.redirect('/product'); // Redirect to the home page after deletion
        } catch (error) {
            res.status(500).send('Error deleting product.');
        }
    });

// Customer route to list all customers
app.get('/customers', async (req, res) => {
    try {
        const customers = await customerManagementToken.listAllCustomers(); // Fetch all customers
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
        const customer = await customerManagementToken.findCustomerById(customer_id); // Fetch customer details
        if (customer) {
            res.render('view-customer', { customer }); // Render the view-customer.ejs template
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
    res.render('add-customer'); // Render the form for adding a new customer
});

// Handle form submission for adding a new customer
app.post('/add-customer', async (req, res) => {
    const { customer_id, customer_first_name, customer_last_name, customer_email, customer_address } = req.body;
    try {
        await customerManagementToken.createCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address);
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
        const customer = await customerManagementToken.findCustomerById(customer_id); // Fetch customer details
        if (customer) {
            res.render('view-customer', { customer }); // Render the view-customer.ejs template
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
        const customer = await customerManagementToken.findCustomerById(id); // Fetch customer details
        if (customer) {
            res.render('update-customer', { customer }); // Render the update form
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
        const updated = await customerManagementToken.updateCustomer(customer_id, customer_first_name, customer_last_name, customer_email, customer_address);
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
        const updated = await customerManagementToken.updateCustomer(id, customer_first_name, customer_last_name, customer_email, customer_address);
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
        const deleted = await customerManagementToken.deleteCustomer(id); // Call the delete function
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
        const shipments = await shipmentManagementToken.listAllShipment(); // Fetch all shipments
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

// Route to view a specific shipment by ID
app.get('/shipment/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    try {
        const shipment = await shipmentManagementToken.findShipmentById(shipment_id); // Fetch shipment details
        if (shipment) {
            res.render('view-shipment', { shipment }); // Render the view-shipment.ejs template
        } else {
            res.status(404).send('Shipment not found.');
        }
    } catch (error) {
        console.error('Error fetching shipment:', error);
        res.status(500).send('Error fetching shipment.');
    }
});

// Route to render form for adding a new shipment
app.get('/add-shipment', (req, res) => {
    res.render('add-shipment'); // Render the form for adding a new shipment
});

// Handle form submission for adding a new shipment
app.post('/add-shipment', async (req, res) => {
    const { shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id } = req.body;
    try {
        await shipmentManagementToken.addShipment(shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id);
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
        const shipment = await shipmentManagementToken.findShipmentById(shipment_id); // Fetch shipment details
        if (shipment) {
            res.render('update-shipment', { shipment }); // Render the update form
        } else {
            res.status(404).send('Shipment not found.');
        }
    } catch (error) {
        console.error('Error fetching shipment for update:', error);
        res.status(500).send('Error fetching shipment.');
    }
});

// Handle form submission for updating a shipment
app.post('/update-shipment/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    const { order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id } = req.body;
    try {
        await shipmentManagementToken.updateShipment(shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id);
        res.redirect(`/shipment/${shipment_id}`); // Redirect to the shipment details page after updating
    } catch (error) {
        console.error('Error updating shipment:', error);
        res.status(500).send('Error updating shipment.');
    }
});

// Route for deleting a shipment
app.post('/delete-shipment/:id', async (req, res) => {
    const shipment_id = req.params.id; // Extract shipment ID from the route parameters
    try {
        await shipmentManagementToken.deleteShipment(shipment_id); // Call the delete function
        res.redirect('/shipments'); // Redirect to the shipment list after deletion
    } catch (error) {
        console.error('Error deleting shipment:', error);
        res.status(500).send('Error deleting shipment.');
    }
});

// Route to manage logistics partners
app.get('/manage-partner', async (req, res) => {
    try {
        const partners = await carrierPartnerTokens.listAllLogisticsPartners(); // Fetch partners from the database
        res.render('partner', { partners }); // Pass the fetched partners to the partner view
    } catch (error) {
        console.error('Error fetching logistics partners:', error);
        res.status(500).send('Error fetching logistics partners.');
    }    
});

// Route to display the Add Partner form
app.get('/add-partner', (req, res) => {
    res.render('add-partner'); // Renders the add-partner.ejs form
});

// Route to handle form submission for adding a new partner
app.post('/add-partner', async (req, res) => {
    const { carrier_id, carrier_name, shipping_service_id, carrier_contact_info } = req.body; // Extract form fields
    try {
        await carrierPartnerTokens.addCarrierPartner(carrier_id, carrier_name, shipping_service_id, carrier_contact_info); // Add the new partner
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
            res.render('update-partner', { partner }); // Render the update form with the partner details
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
        await carrierPartnerTokens.updateLogisticsPartner(carrier_name, shipping_service_id, carrier_contact_info, id); // Update the partner
        res.redirect(`/manage-partner`); // Redirect to the partner details page after update
    } catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).send('Error updating partner.');
    }
});

// DELETE A PARTNER
app.post('/delete-partner/:id', async (req, res) => {
    try {
        await carrierPartnerTokens.deleteLogisticsPartner(req.params.id); // Delete the partner
        res.redirect('/manage-partner'); // Redirect back to partner management page
    } catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).send('Error deleting partner.');
    }
});
app.get('/orders', async (req, res) => {
    try {
        const orders = await orderTokens.listAllOrders(); // Fetch all orders
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
    res.render('manage-order'); // Render the orders page
});

// Route to manage postal orders
app.get('/postal-orders', async (req, res) => {
    try {
        const postalOrders = await orderTokens.listAllPostalOrders(); // Make sure this function exists
        res.render('manage-postal-orders', { postalOrders });
    } catch (error) {
        console.error('Error fetching postal orders:', error);
        res.status(500).send('Error fetching postal orders.');
    }
});

// Route to manage product orders
app.get('/product-orders', async (req, res) => {
    try {
        const productOrders = await orderTokens.listAllProductOrders(); // Make sure this function exists
        res.render('manage-product-orders', { productOrders });
    } catch (error) {
        console.error('Error fetching product orders:', error);
        res.status(500).send('Error fetching product orders.');
    }
});


// Fetch a specific postal order by ID
app.get('/update-postal-order/:id', async (req, res) => {
    const postal_order_id = req.params.id;
    try {
        // Use a function that fetches the postal order by its ID
        const [postalOrder] = await pool.query("SELECT * FROM postal_orders WHERE postal_order_id = ?", [postal_order_id]);
        
        if (postalOrder.length > 0) {
            res.render('update-postal-order', { postalOrder: postalOrder[0] }); // Pass the order details to the view
        } else {
            res.status(404).send('Postal order not found.');
        }
    } catch (error) {
        console.error('Error fetching postal order:', error);
        res.status(500).send('Error fetching postal order.');
    }
});
// Update Postal Order Route
app.get('/update-postal-order/:id', async (req, res) => {
    const postal_order_id = req.params.id;
    try {
        const postalOrder = await orderTokens.viewPostalOrder(postal_order_id); // Call the function to get the postal order
        if (postalOrder) {
            res.render('update-postal-order', { postalOrder }); // Pass the order details to the view
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
        res.render('manage-product-orders', { productOrders }); // Render the EJS file with product orders
    } catch (error) {
        console.error('Error fetching product orders:', error);
        res.status(500).send('Error fetching product orders.');
    }
});

// Route to update product order form
app.get('/update-product-order/:id', async (req, res) => {
    const product_order_id = req.params.id;
    try {
        const [productOrders] = await pool.query("SELECT * FROM product_orders WHERE product_order_id = ?", [product_order_id]);
        if (productOrders.length > 0) {
            res.render('update-product-order', { productOrder: productOrders[0] }); // Pass the order details to the view
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
    const { order_id, product_id, product_quantity, product_unit_price, total_price } = req.body;
    const product_order_id = req.params.id;
    try {
        await orderTokens.updateProductOrders(order_id, product_id, product_quantity, product_unit_price, total_price, product_order_id);
        res.redirect('/manage-product-orders'); // Redirect to the product orders management page after update
    } catch (error) {
        console.error('Error updating product order:', error);
        res.status(500).send('Error updating product order.');
    }
});

// Delete Product Order Route
app.post('/delete-product-order/:id', async (req, res) => {
    const product_order_id = req.params.id;
    try {
        const result = await orderTokens.deleteProductOrder(product_order_id); // Ensure you have this function to handle deletion
        if (result) {
            res.redirect('/manage-product-orders'); // Redirect to product orders management after deletion
        } else {
            res.status(404).send('Product order not found.');
        }
    } catch (error) {
        console.error('Error deleting product order:', error);
        res.status(500).send('Error deleting product order.');
    }
});

// Display the form for adding a new postal order
app.get('/add-postal-order', (req, res) => {
    res.render('add-postal-order');
});

// Handle form submission for adding a new postal order
app.post('/add-postal-order', async (req, res) => {
    const { postal_order_id, order_id, parcel_id, total_price } = req.body; // Extract form fields
    try {
        await orderTokens.addPostalOrders(postal_order_id, order_id, parcel_id, total_price); // Add the new postal order to the database
        res.redirect('/postal-orders'); // Redirect back to postal orders list after successful addition
    } catch (error) {
        console.error('Error adding new postal order:', error);
        res.status(500).send('Error adding new postal order.');
    }
});

// Display the form for adding a new product order
app.get('/add-product-order', (req, res) => {
    res.render('add-product-order');
});
// Handle form submission for adding a new product order
app.post('/add-product-order', async (req, res) => {
    const { product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price } = req.body;
    try {
        await orderTokens.addProductOrders(product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price); // Add the new product order
        res.redirect('/product-orders'); // Redirect to product orders management after successful addition
    } catch (error) {
        console.error('Error adding new product order:', error);
        res.status(500).send('Error adding new product order.');
    }
});



//// Routes for Warehouse Types
//app.get('/warehouse-types', statusAndCategoriesManagementToken.listAllWarehouseTypes);
//app.post('/add-warehouse-type', statusAndCategoriesManagementToken.insertWarehouseType);
//app.post('/update-warehouse-type/:id', statusAndCategoriesManagementToken.updateWarehouseType);
//app.post('/delete-warehouse-type/:id', statusAndCategoriesManagementToken.deleteWarehouseType);
//
//// Routes for Order Types
//app.get('/order-types', statusAndCategoriesManagementToken.listAllOrderTypes);
//app.post('/add-order-type', statusAndCategoriesManagementToken.insertOrderType);
//app.post('/update-order-type/:id', statusAndCategoriesManagementToken.updateOrderType);
//app.post('/delete-order-type/:id', statusAndCategoriesManagementToken.deleteOrderType);
//
//// Routes for Product Categories
//app.get('/product-categories', statusAndCategoriesManagementToken.listAllProductCategories);
//app.post('/add-product-category', statusAndCategoriesManagementToken.insertProductCategory);
//app.post('/update-product-category/:id', statusAndCategoriesManagementToken.updateProductCategory);
//app.post('/delete-product-category/:id', statusAndCategoriesManagementToken.deleteProductCategory);
//
//// Routes for Parcel Categories
//app.get('/parcel-categories', statusAndCategoriesManagementToken.listAllParcelCategories);
//app.post('/add-parcel-category', statusAndCategoriesManagementToken.insertParcelCategory);
//app.post('/update-parcel-category/:id', statusAndCategoriesManagementToken.updateParcelCategory);
//app.post('/delete-parcel-category/:id', statusAndCategoriesManagementToken.deleteParcelCategory);


// Route to render the "Manage Status and Category" page
app.get('/manage-status-and-category', (req, res) => {
    res.render('manage-status-and-category');
});


// Order Status Management
app.get('/manage-order-status', async (req, res) => {
    try {
        const orderStatuses = await statusAndCategoriesManagementToken.getOrderStatuses();
        res.render('manage-order-status', { orderStatuses });
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).send('Error fetching order statuses.');
    }
});

// Shipment Status Management
app.get('/manage-shipment-status', async (req, res) => {
    try {
        const shipmentStatuses = await statusAndCategoriesManagementToken.getShipmentStatuses();
        res.render('manage-shipment-status', { shipmentStatuses });
    } catch (error) {
        console.error('Error fetching shipment statuses:', error);
        res.status(500).send('Error fetching shipment statuses.');
    }
});

// Return Status Management
app.get('/manage-return-status', async (req, res) => {
    try {
        const returnStatuses = await statusAndCategoriesManagementToken.getReturnStatuses();
        res.render('manage-return-status', { returnStatuses });
    } catch (error) {
        console.error('Error fetching return statuses:', error);
        res.status(500).send('Error fetching return statuses.');
    }
});

// Warehouse Types Management
app.get('/manage-warehouse-types', async (req, res) => {
    try {
        const warehouseTypes = await statusAndCategoriesManagementToken.getWarehouseTypes();
        res.render('manage-warehouse-types', { warehouseTypes });
    } catch (error) {
        console.error('Error fetching warehouse types:', error);
        res.status(500).send('Error fetching warehouse types.');
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

// Product Categories Management
app.get('/manage-product-categories', async (req, res) => {
    try {
        const productCategories = await statusAndCategoriesManagementToken.getProductCategories();
        res.render('manage-product-categories', { productCategories });
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).send('Error fetching product categories.');
    }
});

// Parcel Categories Management
app.get('/manage-parcel-categories', async (req, res) => {
    try {
        const parcelCategories = await statusAndCategoriesManagementToken.getParcelCategories();
        res.render('manage-parcel-categories', { parcelCategories });
    } catch (error) {
        console.error('Error fetching parcel categories:', error);
        res.status(500).send('Error fetching parcel categories.');
    }
});



//ORDERS
// Route to display the manage-order-status page
app.get('/manage-order-status', async (req, res) => {
    try {
        const orderStatuses = await statusAndCategoriesManagementToken.getOrderStatuses(); // Fetch statuses from DB
        res.render('manage-order-status', { orderStatuses });
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).send('Error fetching order statuses.');
    }
});

// Route to display the add-order-status form
app.get('/add-order-status', (req, res) => {
    res.render('add-order-status'); // Renders the form to add new status
});

// Route to handle the form submission for adding a new order status
app.post('/add-order-status', async (req, res) => {
    const { order_status_id, order_status_name } = req.body;
    try {
        await statusAndCategoriesManagementToken.insertOrderStatus(order_status_id, order_status_name);
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
            res.render('update-order-status', { orderStatus });
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
        await statusAndCategoriesManagementToken.deleteOrderStatus(order_status_id);
        res.redirect('/manage-order-status');
    } catch (error) {
        console.error('Error deleting order status:', error);
        res.status(500).send('Error deleting order status.');
    }
});

//RETURN STATUS
// Route to display the manage-return-status page
app.get('/manage-return-status', async (req, res) => {
    try {
        const returnStatuses = await statusAndCategoriesManagementToken.getReturnStatuses(); // Fetch return statuses from DB
        res.render('manage-return-status', { returnStatuses });
    } catch (error) {
        console.error('Error fetching return statuses:', error);
        res.status(500).send('Error fetching return statuses.');
    }
});

// Route to display the add-return-status form
app.get('/add-return-status', (req, res) => {
    res.render('add-return-status'); // Renders the form to add a new return status
});

// Route to handle the form submission for adding a new return status
app.post('/add-return-status', async (req, res) => {
    const { return_status_id, return_status_name } = req.body;
    try {
        await statusAndCategoriesManagementToken.insertReturnStatus(return_status_id, return_status_name);
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
            res.render('update-return-status', { returnStatus });
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
        await statusAndCategoriesManagementToken.deleteReturnStatus(return_status_id);
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
        const warehouseTypes = await statusAndCategoriesManagementToken.getWarehouseTypes(); // Fetch warehouse types
        res.render('manage-warehouse-types', { warehouseTypes });
    } catch (error) {
        console.error('Error fetching warehouse types:', error);
        res.status(500).send('Error fetching warehouse types.');
    }
});

// Route to display the add-warehouse-type form
app.get('/add-warehouse-type', (req, res) => {
    res.render('add-warehouse-type'); // Render the form to add a new warehouse type
});

// Route to handle the form submission for adding a new warehouse type
app.post('/add-warehouse-type', async (req, res) => {
    const { warehouse_type_id, warehouse_type_name } = req.body;
    try {
        await statusAndCategoriesManagementToken.insertWarehouseType(warehouse_type_id, warehouse_type_name);
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
            res.render('update-warehouse-type', { warehouseType });
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
        await statusAndCategoriesManagementToken.deleteWarehouseType(warehouse_type_id);
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
        const productCategories = await statusAndCategoriesManagementToken.getProductCategories(); // Fetch product categories
        res.render('manage-product-categories', { productCategories });
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).send('Error fetching product categories.');
    }
});

// Route to display the form to add a new product category
app.get('/add-product-category', (req, res) => {
    res.render('add-product-category'); // Render the EJS file for adding product categories
});


// POST route to add a new product category
app.post('/add-product-category', async (req, res) => {
    const { product_category_id, product_category_name } = req.body;
    try {
        await statusAndCategoriesManagementToken.insertProductCategory(product_category_id, product_category_name); // Insert product category
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
            res.render('update-product-category', { productCategory: rows[0] }); // Pass the current category details to the view
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
        await statusAndCategoriesManagementToken.deleteProductCategory(product_category_id); // Delete product category
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
        const parcelCategories = await statusAndCategoriesManagementToken.getParcelCategories();
        res.render('manage-parcel-categories', { parcelCategories });
    } catch (error) {
        console.error('Error fetching parcel categories:', error);
        res.status(500).send('Error fetching parcel categories.');
    }
});

// Display the form to add a new parcel category
app.get('/add-parcel-category', (req, res) => {
    res.render('add-parcel-category');
});

// Handle the form submission to add a new parcel category
app.post('/add-parcel-category', async (req, res) => {
    const { parcel_category_id, parcel_category_name } = req.body;
    try {
        const result = await statusAndCategoriesManagementToken.insertParcelCategory(parcel_category_id, parcel_category_name);
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
    try {
        const [parcelCategory] = await statusAndCategoriesManagementToken.getParcelCategories(parcelCategoryId);
        if (parcelCategory) {
            res.render('update-parcel-category', { parcelCategory });
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
    const parcelCategoryId = req.params.id;
    const { parcel_category_name } = req.body;
    try {
        const result = await statusAndCategoriesManagementToken.updateParcelCategory(parcelCategoryId, parcel_category_name);
        if (result) {
            res.redirect('/manage-parcel-categories');
        } else {
            res.status(404).send('Parcel category not found.');
        }
    } catch (error) {
        console.error('Error updating parcel category:', error);
        res.status(500).send('Error updating parcel category.');
    }
});

// Handle the request to delete a parcel category
app.post('/delete-parcel-category/:id', async (req, res) => {
    const parcelCategoryId = req.params.id;
    try {
        const result = await statusAndCategoriesManagementToken.deleteParcelCategory(parcelCategoryId);
        if (result) {
            res.redirect('/manage-parcel-categories');
        } else {
            res.status(404).send('Parcel category not found.');
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
