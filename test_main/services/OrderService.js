import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import logger from '../utils/logUtil.js';
import archiver from '../utils/archiveUtil.js';

// get orders
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
                p.product_unit_price AS unit_price,
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
        return rows;
    } catch(error) {
        console.error('Error fetching orders: ', error);
        return [];
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
        if (rows.length > 0) {
            return rows[0];
        } else {
            console.log(`Order with ID ${order_id} not found.`);
            return [];
        }
    } catch (error) {
        console.error('Error fetching order data:', error);
        return [];
    }
};

// add postal order
async function addPostalOrder(order_id, parcel_id) {
    try {
        const [parcel] = await db.query(`
            SELECT parcel_unit_price
            FROM parcels
            WHERE parcel_id = ?;
        `, [parcel_id]);
        const { total_price } = parcel[0];
        const [result] = await db.query(`
            INSERT INTO postal_orders (order_id, parcel_id, total_price) 
            VALUES (?, ?, ?);
        `, [order_id, parcel_id, total_price]
        );
        if (result.affectedRows > 0) {
            console.log(`Added new postal order`);
            const log_message = `Added new postal order with parcel_id ${parcel_id}`;
            logger.addOrderLog(order_id, log_message);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error adding postal order:', error);
        return false;
    }
};

// add product order
async function addProductOrder(order_id, product_id, product_quantity) {
    try {
        const [product] = await db.query(`
            SELECT product_unit_price
            FROM products
            WHERE parcel_id = ?;
        `, [parcel_id]);
        const { unit_price } = parcel[0];
        const total_price = unit_price * product_quantity;
        const [result] = await db.query(`
            INSERT INTO product_orders (order_id, product_id, product_quantity, total_price) 
            VALUES (?, ?, ?, ?);
        `, [newID, order_id, product_id, product_quantity, total_price]);
        if (result.affectedRows > 0) {
            console.log(`Added new product order`);
            const log_message = `Added new product order with product_id ${product_id}`;
            logger.addOrderLog(order_id, log_message);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error adding product order:', error);
        return false;
    }
};

// remove postal order
async function removePostalOrder(order_id, parcel_id) {
    try {
        const [result] = await db.query(`
            DELETE FROM postal_orders WHERE order_id = ? AND parcel_id = ?;
        `, [order_id, parcel_id]);
        if (result.affectedRows > 0) {
            console.log('Unassigned parcel to order.')
            const log_message = `Unassigned parcel ${parcel_id} from order ${order_id}.`;
            logger.addOrderLog(order_id, log_message);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error removing postal order:', error);
        return false;
    }
};

// remove product order
async function removeProductOrder(order_id, product_id) {
    try {
        const [result] = await db.query(`
            DELETE FROM product_orders WHERE order_id = ? AND product_id = ?;
        `, [order_id, product_id]);
        if (result.affectedRows > 0) {
            console.log('Unassigned product to order.')
            const log_message = `Unassigned product ${parcel_id} from order ${order_id}.`;
            logger.addOrderLog(order_id, log_message);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error removing product order:', error);
        return false;
    }
};

// Add a new order
async function addOrder(customer_id, item_id, item_quantity, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount) {
    try {
        const order_status_id = 'OST0000001'; // default starting order status
        const newID = await idGen.generateID('orders', 'order_id', 'ORD');
        const [result] = await db.query(`
            INSERT INTO orders (order_id, customer_id, order_status_id, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `, [newID, customer_id, order_date_time, order_status_id, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount]);
        const log_message = `Added new order with ID ${newID}`;
        logger.addOrderLog(newID, log_message);
        if (result.affectedRows > 0) {
            if (order_type_id === 'postal') {
                await addPostalOrder(newID, item_id);
            } else if (order_type_id === 'product') {
                await addProductOrder(newID, item_id, item_quantity);
            }
            console.log('Order added successfully.');
            return true;
        } else {
            console.log('Failed to add order.');
            return false;
        }
    } catch (error) {
        console.error('Error adding order:', error);
        return false;
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
            const log_message = `Order ${order_id} status updated successfully.`;
            logger.addOrderLog(order_id, log_message);
            return true;
        } else {
            console.log(`No order found with ID ${order_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
};

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

        // if order is cancelled or delivered
        if (order_status_id === 'OST0000006' || order_status_id === 'OST0000005') {
            if (await archiver.archiveOrder(order_id)) {
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
                    const log_message = `Order ${order_id} removed and archived.`;
                    return true;
                } else {
                    console.log('Error removing order.')
                    return false;
                }
            } else {
                console.log('Error archiving order.')
                return false;
            }
        } else {
            console.log('Order cannot be removed unless it is returned or delivered.');
            return false;
        }
    } catch (error) {
        console.error('Error removing order:', error);
        return false;
    }
};

export default {
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