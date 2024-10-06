import db from '../DBConnection.js';
import idGen from './idGenerator.js';

/* Tables involved: 
        employee_roles
        order_status 
        order_types 
        parcel_categories
        product_categories
        return_status
        shipment_status
*/

// Get all employee roles
async function getEmployeeRoles() {
        try {
                const [rows] = await db.query('SELECT * FROM employee_roles;');
                return rows;
        } catch (error) {
                console.error('Error fetching employee roles:', error);
                return [];
        }
};
    
// Add a new employee role
async function addEmployeeRole(employee_role_name) {
        try {
                const newID = await idGen.generateID('employee_roles', 'employee_role_id', 'ROL');
                const [result] = await db.query(`
                        INSERT INTO employee_roles (employee_role_id, employee_role_name) 
                        VALUES (?, ?);
                        `, [newID, employee_role_name]);
                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error adding employee role:', error);
                return false;
        }
};
    
// Remove an employee role if it's not used in employees table
async function removeEmployeeRole(employee_role_id) {
        try {
                // Check if role is used in employees table
                const [employees] = await db.query(`
                        SELECT employee_id FROM employees WHERE employee_role_id = ?;
                        `, [employee_role_id]);

                if (employees.length > 0) {
                        console.log(`Cannot remove role ${employee_role_id}. It's used in employees.`);
                        return false;
                }
                // Remove the role if not used
                const [result] = await db.query(`
                        DELETE FROM employee_roles WHERE employee_role_id = ?;
                        `, [employee_role_id]);
                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error removing employee role:', error);
                return false;
        }
};
    
// Get all order statuses
async function getOrderStatus() {
        try {
                const [rows] = await db.query('SELECT * FROM order_status;');
                return rows;
        } catch (error) {
                console.error('Error fetching order statuses:', error);
                return [];
        }
};
    
// Add a new order status
async function addOrderStatus(order_status_name) {
        try {
                const newID = await idGen.generateID('order_status', 'order_status_id', 'STS');
                const [result] = await db.query(`
                        INSERT INTO order_status (order_status_id, order_status_name) 
                        VALUES (?, ?);
                        `, [newID, order_status_name]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error adding order status:', error);
                return false;
        }
};

// Remove an order status if it's not used in orders table
async function removeOrderStatus(order_status_id) {
        try {
                // Check if status is used in orders table
                const [orders] = await db.query(`
                        SELECT order_id FROM orders WHERE order_status_id = ?;
                        `, [order_status_id]);

                if (orders.length > 0) {
                        console.log(`Cannot remove order status ${order_status_id}. It's used in orders.`);
                        return false;
                }

                // Remove the order status if not used
                const [result] = await db.query(`
                        DELETE FROM order_status WHERE order_status_id = ?;
                        `, [order_status_id]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error removing order status:', error);
                return false;
        }
};
    
// Get all order types
async function getOrderTypes() {
        try {
                const [rows] = await db.query('SELECT * FROM order_types;');
                return rows;
        } catch (error) {
                console.error('Error fetching order types:', error);
                return [];
        }
};
    
    // Add a new order type
    async function addOrderType(order_type_name) {
        try {
                const newID = await idGen.generateID('order_types', 'order_type_id', 'ORT');
                const [result] = await db.query(`
                        INSERT INTO order_types (order_type_id, order_type_name) 
                        VALUES (?, ?);
                        `, [newID, order_type_name]);
        
                return result.affectedRows > 0;
        } catch (error) {
            console.error('Error adding order type:', error);
            return false;
        }
};

    // Remove an order type if it's not used in orders table
    async function removeOrderType(order_type_id) {
        try {
                // Check if type is used in orders table
                const [orders] = await db.query(`
                                SELECT order_id FROM orders WHERE order_type_id = ?;
                        `, [order_type_id]);
        
                if (orders.length > 0) {
                        console.log(`Cannot remove order type ${order_type_id}. It's used in orders.`);
                        return false;
                }
        
                // Remove the order type if not used
                const [result] = await db.query(`
                        DELETE FROM order_types WHERE order_type_id = ?;
                        `, [order_type_id]);
        
                        return result.affectedRows > 0;
        } catch (error) {
                console.error('Error removing order type:', error);
                return false;
        }
};
    
// Get all parcel categories
async function getParcelCategories() {
        try {
                const [rows] = await db.query('SELECT * FROM parcel_categories;');
                return rows;
        } catch (error) {
                console.error('Error fetching parcel categories:', error);
                return [];
        }
};
    
// Add a new parcel category
async function addParcelCategory(parcel_category_name) {
        try {
                const newID = await idGen.generateID('parcel_categories', 'parcel_category_id', 'PAR');
                const [result] = await db.query(`
                        INSERT INTO parcel_categories (parcel_category_id, parcel_category_name) 
                        VALUES (?, ?);
                        `, [newID, parcel_category_name]);
                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error adding parcel category:', error);
                return false;
        }
};
    
// Remove a parcel category if it's not used in parcels table
async function removeParcelCategory(parcel_category_id) {
        try {
                // Check if category is used in parcels table
                const [parcels] = await db.query(`
                        SELECT parcel_id FROM parcels WHERE parcel_category_id = ?;
                        `, [parcel_category_id]);

                if (parcels.length > 0) {
                        console.log(`Cannot remove parcel category ${parcel_category_id}. It's used in parcels.`);
                        return false;
                }

                // Remove the parcel category if not used
                const [result] = await db.query(`
                        DELETE FROM parcel_categories WHERE parcel_category_id = ?;
                        `, [parcel_category_id]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error removing parcel category:', error);
                return false;
        }
};
    
// Get all product categories
async function getProductCategories() {
        try {
                const [rows] = await db.query('SELECT * FROM product_categories;');
                 return rows;
        } catch (error) {
                console.error('Error fetching product categories:', error);
                return [];
        }
};
    
// Add a new product category
async function addProductCategory(product_category_name) {
        try {
                const newID = await idGen.generateID('product_categories', 'product_category_id', 'PRO');
                const [result] = await db.query(`
                        INSERT INTO product_categories (product_category_id, product_category_name) 
                        VALUES (?, ?);
                        `, [newID, product_category_name]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error adding product category:', error);
                return false;
        }
};
    
// Remove a product category if it's not used in products table
async function removeProductCategory(product_category_id) {
        try {
                // Check if category is used in products table
                const [products] = await db.query(`
                        SELECT product_id FROM products WHERE product_category_id = ?;
                        `, [product_category_id]);

                if (products.length > 0) {
                console.log(`Cannot remove product category ${product_category_id}. It's used in products.`);
                return false;
                }

                // Remove the product category if not used
                const [result] = await db.query(`
                        DELETE FROM product_categories WHERE product_category_id = ?;
                        `, [product_category_id]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error removing product category:', error);
                return false;
        }
};
    
// Get all return statuses
async function getReturnStatus() {
        try {
            const [rows] = await db.query('SELECT * FROM return_status;');
            return rows;
        } catch (error) {
                console.error('Error fetching return statuses:', error);
                return [];
        }
};
    
// Add a new return status
async function addReturnStatus(return_status_name) {
        try {
                const newID = await idGen.generateID('return_status', 'return_status_id', 'RET');
                const [result] = await db.query(`
                        INSERT INTO return_status (return_status_id, return_status_name) 
                        VALUES (?, ?);
                        `, [newID, return_status_name]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error adding return status:', error);
                return false;
        }
};
    
// Remove a return status if it's not used in returns table
async function removeReturnStatus(return_status_id) {
        try {
                // Check if status is used in returns table
                const [returns] = await db.query(`
                        SELECT return_id FROM returns WHERE return_status_id = ?;
                        `, [return_status_id]);

                if (returns.length > 0) {
                        console.log(`Cannot remove return status ${return_status_id}. It's used in returns.`);
                        return false;
                }

                // Remove the return status if not used
                const [result] = await db.query(`
                        DELETE FROM return_status WHERE return_status_id = ?;
                        `, [return_status_id]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error removing return status:', error);
                return false;
        }
};
    
// Get all shipment statuses
async function getShipmentStatus() {
        try {
                const [rows] = await db.query('SELECT * FROM shipment_status;');
                return rows;
        } catch (error) {
                console.error('Error fetching shipment statuses:', error);
                return [];
        }
};
    
// Add a new shipment status
async function addShipmentStatus(shipment_status_name) {
        try {
                const newID = await idGen.generateID('shipment_status', 'shipment_status_id', 'SHP');
                const [result] = await db.query(`
                        INSERT INTO shipment_status (shipment_status_id, shipment_status_name) 
                        VALUES (?, ?);
                        `, [newID, shipment_status_name]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error adding shipment status:', error);
                return false;
        }
};
    
// Remove a shipment status if it's not used in shipments table
async function removeShipmentStatus(shipment_status_id) {
        try {
                // Check if status is used in shipments table
                const [shipments] = await db.query(`
                        SELECT shipment_id FROM shipments WHERE shipment_status_id = ?;
                        `, [shipment_status_id]);

                if (shipments.length > 0) {
                        console.log(`Cannot remove shipment status ${shipment_status_id}. It's used in shipments.`);
                        return false;
                }

                // Remove the shipment status if not used
                const [result] = await db.query(`
                        DELETE FROM shipment_status WHERE shipment_status_id = ?;
                        `, [shipment_status_id]);

                return result.affectedRows > 0;
        } catch (error) {
                console.error('Error removing shipment status:', error);
                return false;
        }
};
    
const token_manager = {
        getEmployeeRoles,
        addEmployeeRole,
        removeEmployeeRole,
        getOrderStatus,
        addOrderStatus,
        removeOrderStatus,
        getOrderTypes,
        addOrderType,
        removeOrderType,
        getParcelCategories,
        addParcelCategory,
        removeParcelCategory,
        getProductCategories,
        addProductCategory,
        removeProductCategory,
        getReturnStatus,
        addReturnStatus,
        removeReturnStatus,
        getShipmentStatus,
        addShipmentStatus,
        removeShipmentStatus
};
export default token_manager;