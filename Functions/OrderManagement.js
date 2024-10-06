import pool from "./test_main/DBconnection/DBConnection.js";


const orderTokens = {
    addPostalOrders,
    updatePostalOrders,
    addProductOrders,
    updateProductOrders,
    listAllOrders,
    listAllPostalOrders,
    listAllProductOrders,
    viewPostalOrder
}
// POSTAL ORDERS

// ADD POSTAL ORDER
async function addPostalOrders(postal_order_id, order_id, parcel_id, total_price) {
    try {
        const [result] = await pool.query(
            "INSERT INTO postal_orders (postal_order_id, order_id, parcel_id, total_price) VALUES (?, ?, ?, ?)", 
            [postal_order_id, order_id, parcel_id, total_price]
        );
        console.log('Postal order added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding postal order:', error);
    }
}

// UPDATE POSTAL ORDER
async function updatePostalOrders(order_id, parcel_id, total_price, postal_order_id) {
    try {
        const [result] = await pool.query(
            "UPDATE postal_orders SET order_id = ?, parcel_id = ?, total_price = ? WHERE postal_order_id = ?", 
            [order_id, parcel_id, total_price, postal_order_id]
        );
        if (result.affectedRows > 0) {
            console.log('Postal order updated.');
        } else {
            console.log('No postal order found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating postal order:', error);
    }
}

// PRODUCT ORDERS

// ADD PRODUCT ORDER
async function addProductOrders(product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price) {
    try {
        const [result] = await pool.query(
            "INSERT INTO product_orders (product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)", 
            [product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price]
        );
        console.log('Product order added with ID:', result.insertId);
    } catch (error) {
        console.error('Error adding product order:', error);
    }
}

// UPDATE PRODUCT ORDER
async function updateProductOrders(order_id, product_id, product_quantity, product_unit_price, total_price, product_order_id) {
    try {
        const [result] = await pool.query(
            "UPDATE product_orders SET order_id = ?, product_id = ?, product_quantity = ?, product_unit_price = ?, total_price = ? WHERE product_order_id = ?", 
            [order_id, product_id, product_quantity, product_unit_price, total_price, product_order_id]
        );
        if (result.affectedRows > 0) {
            console.log('Product order updated.');
        } else {
            console.log('No product order found with the given ID.');
        }
    } catch (error) {
        console.error('Error updating product order:', error);
    }
}

// LIST ALL ORDERS
async function listAllOrders() {
    try {
        const [postalOrders] = await pool.query("SELECT * FROM postal_orders");
        const [productOrders] = await pool.query("SELECT * FROM product_orders");

        return {
            postalOrders,
            productOrders,
        };
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// LIST ALL PRODUCT ORDERS
async function listAllProductOrders() {
    try {
        const [productOrders] = await pool.query("SELECT * FROM product_orders");
        return productOrders; // Return all product orders
    } catch (error) {
        console.error('Error fetching product orders:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}

// LIST ALL PARCEL ORDERS
async function listAllPostalOrders() {
    try {
        const [postalOrders] = await pool.query("SELECT * FROM postal_orders");
        return postalOrders; // Return all parcel orders
    } catch (error) {
        console.error('Error fetching parcel orders:', error);
        throw error; // Rethrow the error for handling in the calling context
    }
}
// Function to view a postal order by ID
async function viewPostalOrder(postal_order_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM postal_orders WHERE postal_order_id = ?", [postal_order_id]);
        return rows.length ? rows[0] : null; // Return the order if found, otherwise null
    } catch (error) {
        console.error('Error getting postal order by ID:', error);
        throw error; // Rethrow to handle in the route
    }
}

export default orderTokens;