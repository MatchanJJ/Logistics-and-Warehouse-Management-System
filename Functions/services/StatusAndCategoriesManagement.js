import pool from "../DBconnection/DBConnection.js";

const statusAndCategoriesManagementToken = {
    insertOrderStatus,
    insertShipmentStatus,
    insertReturnStatus,
    insertWarehouseType,
    insertOrderType,
    insertProductCategory,
    insertParcelCategory,
    updateOrderStatus,
    updateShipmentStatus,
    updateReturnStatus,
    updateWarehouseType,
    updateOrderType,
    updateProductCategory,
    updateParcelCategory,
    getOrderStatuses,
    getShipmentStatuses,
    getReturnStatuses,
    getWarehouseTypes,
    getOrderTypes,
    getProductCategories,
    getParcelCategories,
    deleteOrderStatus,
    deleteShipmentStatus,
    deleteReturnStatus,
    deleteWarehouseType,
    deleteOrderType,
    deleteProductCategory,
    deleteParcelCategory,
    listAllOrderStatuses, 
    listAllShipmentStatuses, 
    listAllReturnStatuses, 
    listAllWarehouseTypes, 
    listAllOrderTypes, 
    listAllProductCategories, 
    listAllParcelCategories

}

// ----------- EJS ROUTING FOR THIS FUNCTIONS IS NOT YET DEFINED -----------

// Insert into order_status
async function insertOrderStatus(orderStatusId, orderStatusName) {
    const query = `INSERT INTO order_status (order_status_id, order_status_name) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [orderStatusId, orderStatusName]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Insert into shipment_status
async function insertShipmentStatus(shipmentStatusId, shipmentStatusName) {
    const query = `INSERT INTO shipment_status (shipment_status_id, shipment_status_name) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [shipmentStatusId, shipmentStatusName]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Insert into return_status
async function insertReturnStatus(returnStatusId, returnStatusName) {
    const query = `INSERT INTO return_status (return_status_id, return_status_name) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [returnStatusId, returnStatusName]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Insert into warehouse_types
async function insertWarehouseType(warehouseTypeId, warehouseTypeName) {
    const query = `INSERT INTO warehouse_types (warehouse_type_id, warehouse_type_name) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [warehouseTypeId, warehouseTypeName]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Insert into order_types
async function insertOrderType(orderTypeId, orderTypeName) {
    const query = `INSERT INTO order_types (order_type_id, order_type_name) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [orderTypeId, orderTypeName]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Insert into product_categories
async function insertProductCategory(productCategoryId, productCategoryName) {
    const query = `INSERT INTO product_categories (product_category_id, product_category_name) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [productCategoryId, productCategoryName]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Insert into parcel_categories
// Insert into parcel_categories
async function insertParcelCategory(parcelCategoryId, parcelCategoryName) {
    console.log('Inserting Parcel Category:', parcelCategoryId, parcelCategoryName); // Log values
    const query = `INSERT INTO parcel_categories (parcel_category_id, parcel_category_name) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [parcelCategoryId, parcelCategoryName]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error inserting parcel category:', error); // Log the error
        throw error;
    }
}


// Update order_status
async function updateOrderStatus(orderStatusId, orderStatusName) {
    const query = `UPDATE order_status SET order_status_name = ? WHERE order_status_id = ?`;
    try {
        const [result] = await pool.query(query, [orderStatusName, orderStatusId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Update shipment_status
async function updateShipmentStatus(shipmentStatusId, shipmentStatusName) {
    const query = `UPDATE shipment_status SET shipment_status_name = ? WHERE shipment_status_id = ?`;
    try {
        const [result] = await pool.query(query, [shipmentStatusName, shipmentStatusId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Update return_status
async function updateReturnStatus(returnStatusId, returnStatusName) {
    const query = `UPDATE return_status SET return_status_name = ? WHERE return_status_id = ?`;
    try {
        const [result] = await pool.query(query, [returnStatusName, returnStatusId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Update warehouse_types
async function updateWarehouseType(warehouseTypeId, warehouseTypeName) {
    const query = `UPDATE warehouse_types SET warehouse_type_name = ? WHERE warehouse_type_id = ?`;
    try {
        const [result] = await pool.query(query, [warehouseTypeName, warehouseTypeId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Update order_types
async function updateOrderType(orderTypeId, orderTypeName) {
    const query = `UPDATE order_types SET order_type_name = ? WHERE order_type_id = ?`;
    try {
        const [result] = await pool.query(query, [orderTypeName, orderTypeId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Update product_categories
async function updateProductCategory(productCategoryId, productCategoryName) {
    const query = `UPDATE product_categories SET product_category_name = ? WHERE product_category_id = ?`;
    try {
        const [result] = await pool.query(query, [productCategoryName, productCategoryId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Update parcel_categories
async function updateParcelCategory(parcelCategoryId, parcelCategoryName) {
    const query = `UPDATE parcel_categories SET parcel_category_name = ? WHERE parcel_category_id = ?`;
    try {
        const [result] = await pool.query(query, [parcelCategoryName, parcelCategoryId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}


// Get all order statuses
async function getOrderStatuses() {
    const query = `SELECT * FROM order_status`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get all shipment statuses
async function getShipmentStatuses() {
    const query = `SELECT * FROM shipment_status`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get all return statuses
async function getReturnStatuses() {
    const query = `SELECT * FROM return_status`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get all warehouse types
async function getWarehouseTypes() {
    const query = `SELECT * FROM warehouse_types`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get all order types
async function getOrderTypes() {
    const query = `SELECT * FROM order_types`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get all product categories
async function getProductCategories() {
    const query = `SELECT * FROM product_categories`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get all parcel categories
async function getParcelCategories() {
    const query = `SELECT * FROM parcel_categories`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}


// Delete order_status
async function deleteOrderStatus(orderStatusId) {
    const query = `DELETE FROM order_status WHERE order_status_id = ?`;
    try {
        const [result] = await pool.query(query, [orderStatusId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Delete shipment_status
async function deleteShipmentStatus(shipmentStatusId) {
    const query = `DELETE FROM shipment_status WHERE shipment_status_id = ?`;
    try {
        const [result] = await pool.query(query, [shipmentStatusId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Delete return_status
async function deleteReturnStatus(returnStatusId) {
    const query = `DELETE FROM return_status WHERE return_status_id = ?`;
    try {
        const [result] = await pool.query(query, [returnStatusId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Delete warehouse_type
async function deleteWarehouseType(warehouseTypeId) {
    const query = `DELETE FROM warehouse_types WHERE warehouse_type_id = ?`;
    try {
        const [result] = await pool.query(query, [warehouseTypeId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Delete order_type
async function deleteOrderType(orderTypeId) {
    const query = `DELETE FROM order_types WHERE order_type_id = ?`;
    try {
        const [result] = await pool.query(query, [orderTypeId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Delete product_category
async function deleteProductCategory(productCategoryId) {
    const query = `DELETE FROM product_categories WHERE product_category_id = ?`;
    try {
        const [result] = await pool.query(query, [productCategoryId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// Delete parcel_category
async function deleteParcelCategory(parcelCategoryId) {
    const query = `DELETE FROM parcel_categories WHERE parcel_category_id = ?`;
    try {
        const [result] = await pool.query(query, [parcelCategoryId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// List all order statuses
async function listAllOrderStatuses(req, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM order_status");
        res.render('manage-order-status', { orderStatuses: rows });
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).send('Error fetching order statuses.');
    }
}

// List all shipment statuses
async function listAllShipmentStatuses(req, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM shipment_status");
        res.render('manage-shipment-status', { shipmentStatuses: rows });
    } catch (error) {
        console.error('Error fetching shipment statuses:', error);
        res.status(500).send('Error fetching shipment statuses.');
    }
}

// List all return statuses
async function listAllReturnStatuses(req, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM return_status");
        res.render('manage-return-status', { returnStatuses: rows });
    } catch (error) {
        console.error('Error fetching return statuses:', error);
        res.status(500).send('Error fetching return statuses.');
    }
}

// List all warehouse types
async function listAllWarehouseTypes(req, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM warehouse_types");
        res.render('manage-warehouse-types', { warehouseTypes: rows });
    } catch (error) {
        console.error('Error fetching warehouse types:', error);
        res.status(500).send('Error fetching warehouse types.');
    }
}

// List all order types
async function listAllOrderTypes(req, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM order_types");
        res.render('manage-order-types', { orderTypes: rows });
    } catch (error) {
        console.error('Error fetching order types:', error);
        res.status(500).send('Error fetching order types.');
    }
}

// List all product categories
async function listAllProductCategories(req, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM product_categories");
        res.render('manage-product-categories', { productCategories: rows });
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).send('Error fetching product categories.');
    }
}

// List all parcel categories
async function listAllParcelCategories(req, res) {
    try {
        const [rows] = await pool.query("SELECT * FROM parcel_categories");
        res.render('manage-parcel-categories', { parcelCategories: rows });
    } catch (error) {
        console.error('Error fetching parcel categories:', error);
        res.status(500).send('Error fetching parcel categories.');
    }
}


export default statusAndCategoriesManagementToken;