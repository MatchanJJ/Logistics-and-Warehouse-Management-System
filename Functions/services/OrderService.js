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
                os.order_status_name AS order_status_id,
                s.shipping_service_name AS shipping_service_id,
                o.delivery_address,
                o.shipping_receiver,
                o.order_total_amount,
                s.shipping_service_name
            FROM 
                orders o
            LEFT JOIN 
                shipping_services s ON o.shipping_service_id = s.shipping_service_id
            LEFT JOIN
                order_status os ON o.order_status_id = os.order_status_id;
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
                o.order_date_time AS time_stamp,
                os.order_status_name AS order_status,
                o.delivery_address,
                o.shipping_receiver,
                s.shipping_service_name AS shipping_service,
                o.order_total_amount
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN order_status os ON o.order_status_id = os.order_status_id
            JOIN shipping_services s ON o.shipping_service_id = s.shipping_service_id
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
        const [order_s] = await db.query(`
            SELECT order_status_id
            FROM orders
            WHERE order_id = ?;
        `, [order_id]);

        if (order_s[0].order_status_id === 'OST0000004') {
            console.error('Cannot assign product to order. It is already shipped.', order_id);
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
        
        const [inventory] = await db.query(`
            SELECT warehouse_id, quantity
            FROM parcel_inventories
            WHERE parcel_id = ? AND quantity > 0;  
        `, [parcel_id]);

        if (!inventory.length) {
            console.error('Parcel not available in inventory:', parcel_id);
            return false;
        }

        const total_price = parcel[0].parcel_unit_price;
        const warehouse_id = inventory[0].warehouse_id;

        const [insertResult] = await db.query(`
            INSERT INTO postal_orders (order_id, parcel_id, total_price) 
            VALUES (?, ?, ?);
        `, [order_id, parcel_id, total_price]);

        const [order] = await db.query(`SELECT order_total_amount FROM orders WHERE order_id = ?;`, [order_id]);
        if (!order.length) {
            console.error('Order not found:', order_id);
            return false;
        }

        const order_total_amount = order[0].order_total_amount;
        const new_order_total_amount = (+order_total_amount + +total_price);

        if (insertResult.affectedRows > 0) {
            await InventoryService.updateParcelStockQuantity(parcel_id, warehouse_id, 0);
            await updateOrderTotalAmount(order_id, new_order_total_amount);
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
        const [order_s] = await db.query(`
            SELECT order_status_id
            FROM orders
            WHERE order_id = ?;
        `, [order_id]);

        if (order_s[0].order_status_id === 'OST0000004') {
            console.error('Cannot assign product to order. It is already shipped.', order_id);
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

        const [inventory] = await db.query(`
            SELECT warehouse_id, quantity
            FROM product_inventories
            WHERE product_id = ? ORDER BY quantity DESC LIMIT 1;
        `, [product_id]);

        if (!inventory.length || inventory[0].quantity < product_quantity) {
            console.error('Insufficient inventory for product:', product_id);
            return false; 
        }

        const unit_price = product[0].product_unit_price;
        const total_price = unit_price * product_quantity;
        const warehouse_id = inventory[0].warehouse_id;

        const [insertResult] = await db.query(`
            INSERT INTO product_orders (order_id, product_id, product_quantity, total_price) 
            VALUES (?, ?, ?, ?);
        `, [order_id, product_id, product_quantity, total_price]);

        const [order] = await db.query(`SELECT order_total_amount FROM orders WHERE order_id = ?;`, [order_id]);
        
        if (!order.length) {
            console.error('Order not found:', order_id);
            return false;
        }

        const order_total_amount = order[0].order_total_amount;
        const new_order_total_amount = (+order_total_amount + +total_price);

        if (insertResult.affectedRows > 0) {
            await InventoryService.updateProductStockQuantity(product_id, warehouse_id, inventory[0].quantity - product_quantity);
            await updateOrderTotalAmount(order_id, new_order_total_amount);
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

// remove postal order -- just one to handle orders
async function removePostalOrder(order_id, parcel_id) {
    try {
        const [parcel] = await db.query(`
            SELECT parcel_unit_price
            FROM parcels
            WHERE parcel_id = ?;
        `, [parcel_id]);

        if (!parcel.length) {
            throw new Error('Parcel not found');
        }

        const [inventory] = await db.query(`
            SELECT warehouse_id, quantity
            FROM parcel_inventories
            WHERE parcel_id = ? ORDER BY quantity DESC LIMIT 1;
        `, [parcel_id]);
        
        if (!inventory.length) {
            throw new Error('Inventory not found');
        }

        const warehouse_id = inventory[0].warehouse_id;

        const [order] = await db.query(`SELECT order_total_amount FROM orders WHERE order_id = ?;`, [order_id]);
        if (!order.length) {
            throw new Error('Order not found');
        }

        const order_total_amount = order[0].order_total_amount;
        const unit_price = parcel[0].parcel_unit_price;
        const new_order_total_amount = (+order_total_amount - +unit_price);

        const [result] = await db.query(`
            DELETE FROM postal_orders WHERE order_id = ? AND parcel_id = ?;
        `, [order_id, parcel_id]);

        if (result.affectedRows > 0) {
            await InventoryService.updateParcelStockQuantity(parcel_id, warehouse_id, 1);
            await updateOrderTotalAmount(order_id, new_order_total_amount);
            console.log('Unassigned parcel to order.');
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

// remove product order -- just one to handle orders
async function removeProductOrder(order_id, product_id) {
    try {
        const [product] = await db.query(`
            SELECT product_unit_price
            FROM products
            WHERE product_id = ?;
        `, [product_id]);

        if (!product.length) {
            throw new Error('Product not found');
        }

        const [inventory] = await db.query(`
            SELECT warehouse_id, quantity
            FROM product_inventories
            WHERE product_id = ? ORDER BY quantity DESC LIMIT 1;
        `, [product_id]);
        
        if (!inventory.length) {
            throw new Error('Inventory not found');
        }

        const [reserved] = await db.query(`
            SELECT product_quantity
            FROM product_orders
            WHERE order_id = ? AND product_id = ?;
        `, [order_id, product_id]);

        if (!reserved.length) {
            throw new Error('Reserved quantity not found');
        }

        const warehouse_id = inventory[0].warehouse_id;
        const reservedQuantity = reserved[0].product_quantity;
        const unit_price = product[0].product_unit_price;

        const [order] = await db.query(`SELECT order_total_amount FROM orders WHERE order_id = ?;`, [order_id]);
        if (!order.length) {
            throw new Error('Order not found');
        }

        const order_total_amount = order[0].order_total_amount;
        const total_price = unit_price * reservedQuantity;
        const new_order_total_amount = (+order_total_amount - +total_price);

        const [result] = await db.query(`
            DELETE FROM product_orders WHERE order_id = ? AND product_id = ?;
        `, [order_id, product_id]);

        if (result.affectedRows > 0) {
            await InventoryService.updateProductStockQuantity(product_id, warehouse_id, inventory[0].quantity + reservedQuantity);
            await updateOrderTotalAmount(order_id, new_order_total_amount);
            console.log('Unassigned product from order.');
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
            INSERT INTO orders (order_id, customer_id, order_date_time, order_status_id, shipping_service_id, delivery_address, shipping_receiver, order_total_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 0.00);
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

// update order total amount
async function updateOrderTotalAmount(order_id, new_total_amount) {
    const [result] = await db.query(`
        UPDATE orders SET order_total_amount = ? WHERE order_id = ?;
    `, [new_total_amount, order_id]);
    if (result.affectedRows > 0) {
        console.log(`Total amount update successful: ${new_total_amount}.`);
    }
}

// Remove all postal orders for a given order -- only used for removeOrders
async function removeAllPostalOrders(order_id) {
    try {
        const [postalOrders] = await db.query(`
            SELECT parcel_id FROM postal_orders WHERE order_id = ?;
        `, [order_id]);

        for (const order of postalOrders) {
            await db.query(`DELETE FROM postal_orders WHERE order_id = ? AND parcel_id = ?`, 
                [order_id, order.parcel_id]);
        }
    } catch (error) {
        console.error('Error removing postal orders:', error);
    }
};

// Remove all product orders for a given order -- only used for removeOrders
async function removeAllProductOrders(order_id) {
    try {
        const [productOrders] = await db.query(`
            SELECT product_id FROM product_orders WHERE order_id = ?;
        `, [order_id]);

        for (const order of productOrders) {
            await db.query(`DELETE FROM product_orders WHERE order_id = ? AND product_id = ?`, 
                [order_id, order.product_id]);
        }
    } catch (error) {
        console.error('Error removing product orders:', error);
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

        // If order is not cancelled or delivered
        if (order_status_id !== 'OST0000006' && order_status_id !== 'OST0000005') {
            console.log('Order cannot be removed unless it is returned or delivered.');
            return false;
        }

        // delete shipments associated with the order
        const [shipment] = await db.query(`SELECT shipment_id FROM shipments WHERE order_id = ?;`, [order_id]);
        const shipment_id = shipment[0].shipment_id;
        if (!(await ShipmentService.removeShipment(shipment_id))) {
            console.log(`Error removing shipment, order cannot be removed.`);
            return false;
        }

        if (await archiver.archiveOrder(order_id)) {

            await removeAllPostalOrders(order_id);
            await removeAllProductOrders(order_id);

            const [result] = await db.query(`
                DELETE FROM orders WHERE order_id = ?;
            `, [order_id]);

            if (result.affectedRows > 0) {
                console.log(`Order ${order_id} successfully removed.`);
                const log_message = `Order ${order_id} removed and archived.`;
                await logger.addOrderLog(order_id, log_message);
                return true;
            } else {
                console.log('Error removing order.');
                return false;
            }
        } else {
            console.log('Error archiving order.');
            return false;
        }
    } catch (error) {
        console.error('Error removing order:', error);
        return false;
    }
;}

// cancel order
async function cancelOrder(order_id) {
    try {
        // Check if the order is pending
        const [order] = await db.query(`
            SELECT order_status_id
            FROM orders
            WHERE order_id = ?;
        `, [order_id]);

        if (order[0].order_status_id === 'OST0000004' || order[0].order_status_id === 'OST0000005') {
            console.error('Order can no longer be canceled. It is already shipped.', order_id);
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
        await updateOrderStatus(order_id, 'OST0000006'); 

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
        const [productOrders] = await db.query(`
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
        const [parcelOrders] = await db.query(`
            SELECT 
                po.order_id,
                po.parcel_id,
                p.parcel_unit_price AS unit_price,
                po.total_price
            FROM 
                postal_orders po
            JOIN 
                parcels p ON po.parcel_id = p.parcel_id;
            `);
        return parcelOrders;
    } catch (error) {
        console.error('Error fetching parcel orders:', error);
        return [];
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
    removeOrder,
    cancelOrder,
    shipOrder,
    listAllParcelOrders,
    listAllProductOrders,
    updateOrderTotalAmount
};