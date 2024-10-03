import db from '../dbConnection/DBConnection.js';
import idGen from './idGenerator.js';

const token_manager = {
    getOrders,
    getOrderData,
    addPostalOrder,
    addProductOrder,
    removePostalOrder,
    removeProductOrder,
    addOrder,
    updateOrderStatus,
    removeOrder
};

async function getOrders () {
    try {
        const [rows] = await db.query (
            `(
            SELECT
                o.order_id AS order_id,
                CONCAT(c.customer_first_name, ' ', c.customer_last_name) AS customer_name,
                os.order_status_name AS order_status,
                s.shipping_service_name AS shipping_service,
                o.shipping_address AS shipping_address, 
                o.shipping_receiver AS shipping_receiver,
                ot.order_type_name AS order_type,
                po.product_unit_price AS unit_price,
                'product' AS item_type,
                o.order_total_amount AS total_amount,
                GROUP_CONCAT(p.product_name SEPARATOR ', ') AS order_items,
                SUM(po.product_quantity) AS total_quantity,
                pc.product_category_name AS category
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN order_status os ON o.order_status_id = os.order_status_id
            JOIN shipping_services s ON o.shipping_service_id = s.shipping_service_id
            JOIN order_types ot ON o.order_type_id = ot.order_type_id
            JOIN product_orders po ON o.order_id = po.order_id
            JOIN products p ON po.product_id = p.product_id
            JOIN product_categories pc ON p.product_category_id = pc.product_category_id
            GROUP BY o.order_id
        )
        UNION ALL
        (
            SELECT
                o.order_id AS order_id,
                CONCAT(c.customer_first_name, ' ', c.customer_last_name) AS customer_name,
                os.order_status_name AS order_status,
                s.shipping_service_name AS shipping_service,
                o.shipping_address AS shipping_address,
                o.shipping_receiver AS shipping_receiver,
                ot.order_type_name AS order_type,
                par.parcel_unit_price AS unit_price,
                'parcel' AS item_type,
                o.order_total_amount AS total_amount,
                GROUP_CONCAT(par.parcel_description SEPARATOR ', ') AS order_items,
                1 AS total_quantity,
                parc.parcel_category_name AS category
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN order_status os ON o.order_status_id = os.order_status_id
            JOIN shipping_services s ON o.shipping_service_id = s.shipping_service_id
            JOIN order_types ot ON o.order_type_id = ot.order_type_id
            JOIN postal_orders po ON o.order_id = po.order_id
            JOIN parcels par ON po.parcel_id = par.parcel_id
            JOIN parcel_categories parc ON par.parcel_category_id = parc.parcel_category_id
            GROUP BY o.order_id 
            );`
        );
        //ORDER BY order_id, item_type;
        return rows;
    } catch(error) {
        console.error(error);
    }
};

// get specific order data
async function getOrderData(order_id) {
    try {
        const [rows] = await db.query(`
            SELECT
                o.order_id,
                CONCAT(c.customer_first_name, ' ', c.customer_last_name) AS customer_name,
                os.order_status_name AS order_status,
                s.shipping_service_name AS shipping_service,
                o.shipping_address,
                o.shipping_receiver,
                ot.order_type_name AS order_type,
                o.order_total_amount
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN order_status os ON o.order_status_id = os.order_status_id
            JOIN shipping_services s ON o.shipping_service_id = s.shipping_service_id
            JOIN order_types ot ON o.order_type_id = ot.order_type_id
            WHERE o.order_id = ?;
        `, [order_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching order data:', error);
    }
};


// add postal order
async function addPostalOrder(order_id, parcel_id, total_price) {
    const newID = await idGen.generateID('postal_orders', 'postal_order_id', 'POL');
    try {
        const [result] = await db.query(`
            INSERT INTO postal_orders (postal_order_id, order_id, parcel_id, total_price) 
            VALUES (?, ?, ?, ?);
        `, [newID, order_id, parcel_id, total_price]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding postal order:', error);
    }
};

// add product order
async function addProductOrder(order_id, product_id, total_price) {
    const newID = await idGen.generateID('product_orders', 'product_order_id', 'PRO');
    try {
        const [result] = await db.query(`
            INSERT INTO product_orders (product_order_id, order_id, product_id, total_price) 
            VALUES (?, ?, ?, ?);
        `, [newID, order_id, product_id, total_price]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error adding product order:', error);
    }
};


// remove postal order
async function removePostalOrder(order_id) {
    try {
        const [result] = await db.query(`
            DELETE FROM postal_orders WHERE order_id = ?;
        `, [order_id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error removing postal order:', error);
    }
};

// remove product order
async function removeProductOrder(order_id) {
    try {
        const [result] = await db.query(`
            DELETE FROM product_orders WHERE order_id = ?;
        `, [order_id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error removing product order:', error);
    }
};


// Add a new order
async function addOrder(customer_id, order_date_time, order_status_id, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount, item_id) {
    try {
        const newID = await idGen.generateID('orders', 'order_id', 'ORD');
        const [result] = await db.query(`
            INSERT INTO orders (order_id, customer_id, order_date_time, order_status_id, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [newID, customer_id, order_date_time, order_status_id, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount]);

        if (result.affectedRows > 0) {
            if (order_type_id === 'postal') {
                const total_price = 'calculate total price';
                await addPostalOrder(newID, item_id, total_price);
            } else if (order_type_id === 'product') {
                const total_price = 'calculate total price';
                await addProductOrder(newID, item_id, total_price);
            }
            console.log('Order added successfully.');
            return newID;
        } else {
            console.log('Failed to add order.');
            return null;
        }
    } catch (error) {
        console.error('Error adding order:', error);
    }
};

// Update order status
async function updateOrderStatus(order_id, new_order_status_id) {
    try {
        const [result] = await db.query(`
            UPDATE orders SET order_status_id = ? WHERE order_id = ?;
        `, [new_order_status_id, order_id]);

        if (result.affectedRows > 0) {
            console.log(`Order ${order_id} status updated successfully.`);
            return true;
        } else {
            console.log(`No order found with ID ${order_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating order status:', error);
    }
};

// remove order -- possible only if status is either returned or delivered
// Remove order -- only if status is either returned or delivered
async function removeOrder(order_id) {
    try {
        // Check the order status
        const [rows] = await db.query(`
            SELECT order_status_id FROM orders WHERE order_id = ?;
        `, [order_id]);

        if (rows.length === 0) {
            console.log('Order not found.');
            return false;
        }

        const { order_status_id } = rows[0];

        // Ensure the order is either 'returned' or 'delivered'
        if (order_status_id === 'returned' || order_status_id === 'delivered') {
            const [orderType] = await db.query(`
                SELECT order_type_id FROM orders WHERE order_id = ?;
            `, [order_id]);

            const { order_type_id } = orderType[0];

            // Remove associated product or postal order
            if (order_type_id === 'postal') {
                await removePostalOrder(order_id);
            } else if (order_type_id === 'product') {
                await removeProductOrder(order_id);
            }

            // Remove the order itself
            const [result] = await db.query(`
                DELETE FROM orders WHERE order_id = ?;
            `, [order_id]);

            if (result.affectedRows > 0) {
                console.log(`Order ${order_id} successfully removed.`);
                return true;
            }
        } else {
            console.log('Order cannot be removed unless it is returned or delivered.');
            return false;
        }
    } catch (error) {
        console.error('Error removing order:', error);
    }
};

export default token_manager;