import db from '../DBconnection/DBConnection.js';
import idGen from '../utils/idGenerator.js';
import logger from '../utils/logUtil.js';
import archiver from '../utils/archiveUtil.js';
import InventoryService from './InventoryService.js';
import ShipmentService from './ShipmentService.js';

// get all orders
async function getOrders (order_id) { 
    try {
        const [rows] = await db.query (
            `SELECT 
                o.order_id,
                o.customer_id,
                o.order_date_time,
                o.order_status_id,
                o.shipping_service_id,
                o.delivery_address,
                o.shipping_receiver,
                o.order_total_amount,
                s.shipping_service_name
            FROM 
                orders o
            LEFT JOIN 
                shipping_services s ON o.shipping_service_id = s.shipping_service_id;
            `
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
        const [inventory] = await db.query(`
            SELECT parcel_id, warehouse_id
            FROM parcel_inventories
            WHERE parcel_id = ? AND quantity = 1;
        `, [parcel_id]);

        if (!inventory.length) {
            console.error('Parcel not available in inventory:', parcel_id);
            return false;
        }

        const [parcel] = await db.query(`
            SELECT parcel_unit_price
            FROM parcels
            WHERE parcel_id = ?;
        `, [parcel_id]);

        if (!parcel.length) {
            console.error('Parcel not found:', parcel_id);
            return false; 
        }

        const total_price = parcel[0].parcel_unit_price;
        const warehouse_id = inventory[0].warehouse_id;

        const [insertResult] = await db.query(`
            INSERT INTO postal_orders (order_id, parcel_id, total_price) 
            VALUES (?, ?, ?);
        `, [order_id, parcel_id, total_price]);

        if (insertResult.affectedRows > 0) {
            // Update the parcel inventory quantity
            await InventoryService.updateParcelStockQuantity(parcel_id, warehouse_id, 0); // Setting quantity to 0 after order
            
            console.log(`Added new postal order for parcel_id: ${parcel_id}`);
            const log_message = `Added new postal order with parcel_id ${parcel_id}`;
            await logger.addOrderLog(order_id, log_message);
            return true;
        } else {
            console.error('Failed to insert postal order:', { order_id, parcel_id });
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
        const [inventory] = await db.query(`
            SELECT warehouse_id, quantity
            FROM product_inventories
            WHERE product_id = ?;
        `, [product_id]);

        if (!inventory.length || inventory[0].quantity < product_quantity) {
            console.error('Insufficient inventory for product:', product_id);
            return false; 
        }

        const [product] = await db.query(`
            SELECT product_unit_price
            FROM products
            WHERE product_id = ?;
        `, [product_id]);

        if (!product.length) {
            console.error('Product not found:', product_id);
            return false;
        }

        const unit_price = product[0].product_unit_price;
        const total_price = unit_price * product_quantity;

        const [insertResult] = await db.query(`
            INSERT INTO product_orders (order_id, product_id, product_quantity, total_price) 
            VALUES (?, ?, ?, ?);
        `, [order_id, product_id, product_quantity, total_price]);

        if (insertResult.affectedRows > 0) {
            const warehouse_id = inventory[0].warehouse_id;
            await InventoryService.updateProductStockQuantity(product_id, warehouse_id, inventory[0].quantity - product_quantity);
            console.log(`Added new product order for product_id: ${product_id}`);
            const log_message = `Added new product order with product_id ${product_id}`;
            await logger.addOrderLog(order_id, log_message);
            return true;
        } else {
            console.error('Failed to insert product order:', { order_id, product_id });
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
            await logger.addOrderLog(order_id, log_message);
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
            const log_message = `Unassigned product ${product_id} from order ${order_id}.`;
            await logger.addOrderLog(order_id, log_message);
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
async function addOrder(customer_id, shipping_service_id, shipping_address, shipping_receiver) {
    try {
        const order_status_id = 'OST0000001'; // default starting order status - change depend on the DM populate/ finalize soon
        const newID = await idGen.generateID('orders', 'order_id', 'ORD');
        const order_date_time = new Date();
        const [result] = await db.query(`
            INSERT INTO orders (order_id, customer_id, order_date_time, order_status_id, shipping_service_id, delivery_address, shipping_receiver) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [newID, customer_id, order_date_time, order_status_id, shipping_service_id, shipping_address, shipping_receiver]);
        if (result.affectedRows > 0) {
            console.log('Added new order.')
            const log_message = `Added new order with ID ${newID}`;
            await logger.addOrderLog(newID, log_message);
            return true;
        } else {
            console.log('Error adding order.');
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
            await logger.addOrderLog(order_id, log_message);
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
                    await logger.addOrderLog(order_id, log_message);
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

// cancel order
async function cancelOrder(order_id) {
    try {
        // Check if the order is pending
        const [order] = await db.query(`
            SELECT order_status_id
            FROM orders
            WHERE order_id = ?;
        `, [order_id]);

        if (!order || order[0].order_status_id !== 'pending') {
            console.error('Order cannot be canceled, it is not pending:', order_id);
            return false; 
        }

        // Retrieve item orders associated with this order
        const [itemOrders] = await db.query(`
            SELECT 'product' AS item_type,
            product_id AS item_id, 
            product_quantity AS item_quantity
            FROM product_orders
            WHERE order_id = ?
            UNION
            SELECT 'parcel' as item_type, 
            parcel_id AS item_id,
            1 as item_quantity
            FROM postal_orders
            WHERE order_id = ? 
        `, [order_id, order_id]);

        // Update the order status to canceled
        await updateOrderStatus(order_id, 'cancelled'); // change

        // Update item inventories
        for (const itemOrder of itemOrders) {
            const { item_type, item_id, item_quantity } = itemOrder;

            if (item_type === 'product') {
                const [inventory] = await db.query(`
                    SELECT warehouse_id, quantity
                    FROM product_inventories
                    WHERE product_id = ?;
                `, [item_id]);
                if (inventory.length) {
                    const warehouse_id = inventory[0].warehouse_id;
                    const new_quantity = inventory[0].quantity + item_quantity;
                    await InventoryService.updateProductStockQuantity(item_id, warehouse_id, new_quantity);
                } else {
                    console.warn('Inventory not found for product_id:', item_id);
                }
            } else if (item_type === 'parcel') {
                const [inventory] = await db.query(`
                    SELECT warehouse_id, quantity
                    FROM parcel_inventories
                    WHERE parcel_id = ?;
                `, [item_id]);
                if (inventory.length) {
                    const warehouse_id = inventory[0].warehouse_id;
                    const new_quantity = inventory[0].quantity + item_quantity;
                    await InventoryService.updateParcelStockQuantity(item_id, warehouse_id, new_quantity);
                } else {
                    console.warn('Inventory not found for parcel_id:', item_id);
                }
            }
        }
                     
        console.log(`Order ${order_id} has been canceled and inventory updated.`);
        const log_message = `Order canceled.`;
        await logger.addOrderLog(order_id, log_message);
        return true;
    } catch (error) {
        console.error('Error canceling order:', error);
        return false;
    }
};


// ship order 
async function shipOrder(order_id, carrier_id) {
    try {
        // Check if the order status is 'picked'
        const [order] = await db.query(`
            SELECT order_status_id FROM orders WHERE order_id = ?;
        `, [order_id]);

        if (order.length === 0) {
            console.log(`Order ${order_id} not found.`);
            return false;
        }

        const order_status_id = order[0].order_status_id;

        if (order_status_id !== 'OST0000003') {
            console.log(`Order ${order_id} is not packed. Cannot ship.`);
            return false;
        }

        // Try to add a shipment
        const shipmentSuccess = await ShipmentService.addShipment(order_id, carrier_id);
        
        if (shipmentSuccess) {
            console.log(`Shipment for order ${order_id} created successfully.`);
            
            // Log the action
            const log_message = "Order handed to carrier.";
            await logger.addOrderLog(order_id, log_message);

            return true;
        } else {
            console.log(`Failed to create shipment for order ${order_id}.`);
            return false;
        }
    } catch (error) {
        console.error('Error shipping order:', error);
        return false;
    }
};
// list all product orders
async function listAllProductOrders() {
    try {
        const [productOrders] = await pool.query(`
            SELECT 
                po.order_id,
                po.product_id,
                p.product_unit_price,
                po.product_quantity,
                po.total_price
            FROM 
                product_orders po
            JOIN 
                products p ON po.product_id = p.product_id;
            `);
        return productOrders; // Return all product orders
    } catch (error) {
        console.error('Error fetching product orders:', error);
        return [];
    }
};

// list all parcel orders
async function listAllParcelOrders() {
    try {
        const [parcelOrders] = await pool.query(`
            SELECT 
                po.order_id,
                po.parcel_id,
                p.parcel_unit_price,
                po.total_price
            FROM 
                postal_orders po
            JOIN 
                parcels p ON po.parcel_id = p.parcel_id;
            `);
    } catch (error) {
        console.error('Error fetching parcel orders:', error);
        return [];
    }
};


export default {
    viewOrders,
    getOrderData,
    addPostalOrder,
    addProductOrder,
    removePostalOrder,
    removeProductOrder,
    addOrder,
    updateOrderStatus,
    removeOrder,
    cancelOrder,
    shipOrder,
    listAllParcelOrders,
    listAllProductOrders
};