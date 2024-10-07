import WarehouseServices from "../services/WarehouseServices";

// Controller for deleting a warehouse by ID
export const deleteWarehouse = async (req, res) => {
    const { id } = req.params;  // Extract warehouse ID from the route parameters
    try {
        await WarehouseServices.removeWarehouse(id); // Call the service function to delete
        res.redirect('/warehouses');  // Redirect to the list of warehouses after deletion
    } catch (error) {
        console.error('Error deleting warehouse:', error);
        res.status(500).send('Error deleting warehouse.');
    }
};

// Controller for listing all warehouses
export const getWarehouses = async (req, res) => {
    try {
        const warehouses = await WarehouseServices.getWarehouses;  // Fetch all warehouses
        res.render('layout', {
            title: 'Warehouse List',
            content: 'warehouses',  // Render warehouses.ejs with the fetched data
            warehouses
        });
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        res.status(500).send('Error fetching warehouses.');
    }
};

// Controller to render the form for adding a new warehouse
export const renderAddWarehouseForm = (req, res) => {
    res.render('layout', {
        title: 'Add Warehouse',
        content: 'add-warehouse'  // Load the 'add-warehouse' form
    });
};

// Controller to handle the form submission for adding a new warehouse
export const addWarehouse = async (req, res) => {
    const { warehouse_id, warehouse_address, capacity, warehouse_type_id } = req.body;  // Extract form data
    try {
        console.log('Adding warehouse:', { warehouse_id, warehouse_address, capacity, warehouse_type_id });  // Debugging

        await WarehouseServices.addWarehouse(warehouse_id, warehouse_address, capacity, warehouse_type_id);
        res.redirect('/warehouses');  // Redirect to warehouse list after success
    } catch (error) {
        console.error('Error adding warehouse:', error);
        res.status(500).send('Error adding warehouse.');
    }
};

// Controller to render the form for updating a warehouse
export const renderUpdateWarehouseForm = async (req, res) => {
    const { id } = req.params;  // Get warehouse ID from route parameters
    try {
        const warehouse = await WarehouseServices.findWarehouseById(id);  // Fetch warehouse details by ID
        if (warehouse) {
            res.render('layout', {
                title: 'Update Warehouse',
                content: 'update-warehouse',  // Render the 'update-warehouse' form
                warehouse  // Pass the warehouse details to the form
            });
        } else {
            res.status(404).send('Warehouse not found.');
        }
    } catch (error) {
        console.error('Error fetching warehouse for update:', error);
        res.status(500).send('Error fetching warehouse.');
    }
};

// Controller to handle the form submission for updating a warehouse
export const updateWarehouse = async (req, res) => {
    const { id } = req.params;  // Extract warehouse ID from the route
    const { warehouse_address, capacity, warehouse_type_id } = req.body;  // Get the updated form data
    try {
        await WarehouseServices.updateWarehouseDetails(id, warehouse_address, capacity, warehouse_type_id);
        res.redirect('/warehouses');  // Redirect after successful update
    } catch (error) {
        console.error('Error updating warehouse:', error);
        res.status(500).send('Error updating warehouse.');
    }
};

// Controller to check the availability of warehouses
export const checkWarehouseAvailability = async (req, res) => {
    try {
        const warehouses = await WarehouseServices.getWarehouses();  // Fetch the list of warehouses
        const warehouseAvailability = [];

        // Loop through each warehouse and check availability
        for (const warehouse of warehouses) {
            const isAvailable = await warehouseManagementToken.checkWarehouseAvailability(warehouse.warehouse_id);
            warehouseAvailability.push({
                ...warehouse,
                isAvailable: isAvailable ? 'Available' : 'Full'  // Mark warehouse availability
            });
        }

        // Render the availability page
        res.render('layout', {
            title: 'Warehouse Availability',
            content: 'check-availability',  // Load the content for checking availability
            warehouseAvailability  // Pass the availability data
        });
    } catch (error) {
        console.error('Error checking warehouse availability:', error);
        res.status(500).send('Error checking warehouse availability.');
    }
};
