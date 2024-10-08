CREATE TABLE warehouse_types (
    warehouse_type_id VARCHAR(10) PRIMARY KEY,
    warehouse_type_name VARCHAR(75) NOT NULL  -- e.g., 'postal', 'e-commerce', 'both'
);

CREATE TABLE order_status (
    order_status_id VARCHAR(10) PRIMARY KEY,
    order_status_name VARCHAR(75) NOT NULL  -- 'pending', 'picked', 'shipped', etc.
);

CREATE TABLE shipment_status (
    shipment_status_id VARCHAR(10) PRIMARY KEY,
    shipment_status_name VARCHAR(75) NOT NULL  -- 'pending', 'in-transit', 'delivered'
);

CREATE TABLE order_types (
    order_type_id VARCHAR(10) PRIMARY KEY,
    order_type_name VARCHAR(75) NOT NULL  -- 'postal', 'e-commerce'
);

CREATE TABLE return_status (
    return_status_id VARCHAR(10) PRIMARY KEY,
    return_status_name VARCHAR(75) NOT NULL  -- 'pending', 'processed', 'returned'
);

CREATE TABLE employee_roles (
    employee_role_id VARCHAR(10) PRIMARY KEY,
    role_name VARCHAR(75) NOT NULL  -- 'picker', 'packaging', 'security', 'management', etc
);

CREATE TABLE warehouses (
    warehouse_id VARCHAR(10) PRIMARY KEY,
    warehouse_address VARCHAR(250) NOT NULL,
    capacity FLOAT(6, 2) NOT NULL,
    warehouse_type_id VARCHAR(10),
    FOREIGN KEY (warehouse_type_id) REFERENCES warehouse_types(warehouse_type_id)
);

CREATE TABLE warehouse_locations (
    warehouse_location_id VARCHAR(10) PRIMARY KEY,
    warehouse_id VARCHAR(10),
    section VARCHAR(75),
    aisle VARCHAR(75),
    rack VARCHAR(75),
    shelf VARCHAR(75),
    bin VARCHAR(75),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
);

CREATE TABLE product_categories (
    product_category_id VARCHAR(10) PRIMARY KEY,
    product_category_name VARCHAR(75) NOT NULL -- e-commerce product categories like 'electronics', 'apparel', 'home goods', 'books', 'office supplies', etc.
);

CREATE TABLE parcel_categories (
    parcel_category_id VARCHAR(10) PRIMARY KEY,
    parcel_category_name VARCHAR(75) NOT NULL -- 'letters', 'documents', 'small parcel', 'medium parcel', 'large parcel', 'registered mail', 'oversized parcel', etc.
);

CREATE TABLE products (
    product_id VARCHAR(10) PRIMARY KEY,
    product_category_id VARCHAR(10),
    product_name VARCHAR(75) NOT NULL,
    product_brand VARCHAR(75),
    product_supplier VARCHAR(75),
    product_description TEXT,
    product_unit_price DECIMAL(10, 2) NOT NULL,
    product_weight FLOAT(6, 2) NOT NULL,
    product_length FLOAT(6, 2) NOT NULL,
    product_width FLOAT(6, 2) NOT NULL,
    product_height FLOAT(6, 2) NOT NULL,
    is_fragile BOOLEAN DEFAULT FALSE,
    is_perishable BOOLEAN DEFAULT FALSE,
    is_hazardous BOOLEAN DEFAULT FALSE,
    is_oversized BOOLEAN DEFAULT FALSE,
    is_returnable BOOLEAN DEFAULT TRUE,
    is_temperature_sensitive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_category_id) REFERENCES product_categories(product_category_id)
);

CREATE TABLE parcels (
    parcel_id VARCHAR(10) PRIMARY KEY,
    parcel_category_id VARCHAR(10),
    parcel_description TEXT,
    parcel_unit_price DECIMAL(10, 2) NOT NULL,
    parcel_weight FLOAT(6, 2) NOT NULL,
    parcel_length FLOAT(6, 2) NOT NULL,
    parcel_width FLOAT(6, 2) NOT NULL,
    parcel_height FLOAT(6, 2) NOT NULL,
    is_fragile BOOLEAN DEFAULT FALSE,
    is_perishable BOOLEAN DEFAULT FALSE,
    is_hazardous BOOLEAN DEFAULT FALSE,
    is_oversized BOOLEAN DEFAULT FALSE,
    is_returnable BOOLEAN DEFAULT TRUE,
    is_temperature_sensitive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (parcel_category_id) REFERENCES parcel_categories(parcel_category_id)
);

CREATE TABLE product_inventories (
    product_id VARCHAR(10),
    warehouse_id VARCHAR(10),
    warehouse_location_id VARCHAR(10),
    quantity INT(6) NOT NULL,
    total_volume FLOAT(6, 2) NOT NULL,
    PRIMARY KEY (warehouse_id, product_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id),
    FOREIGN KEY (warehouse_location_id) REFERENCES warehouse_locations(warehouse_location_id)
);

CREATE TABLE parcel_inventories (
    parcel_id VARCHAR(10),
    warehouse_id VARCHAR(10),
    warehouse_location_id VARCHAR(10),
    quantity INT(6) NOT NULL,
    total_volume FLOAT(6, 2) NOT NULL,
    PRIMARY KEY (warehouse_id, parcel_id),
    FOREIGN KEY (parcel_id) REFERENCES parcels(parcel_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id),
    FOREIGN KEY (warehouse_location_id) REFERENCES warehouse_locations(warehouse_location_id)
);

CREATE TABLE customers (
    customer_id VARCHAR(10) PRIMARY KEY,
    customer_first_name VARCHAR(75) NOT NULL,
    customer_last_name VARCHAR(75),
    customer_email VARCHAR(255),
    customer_address TEXT
);

CREATE TABLE shipping_services (
    shipping_service_id VARCHAR(10) PRIMARY KEY,
    shipping_service_name VARCHAR(75) NOT NULL -- 'standard', 'express', 
);

CREATE TABLE orders (
    order_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10),
    order_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status_id VARCHAR(10),
    shipping_service_id VARCHAR(10),
    delivery_address TEXT NOT NULL,
    shipping_receiver VARCHAR(255),
    order_type_id VARCHAR(10),
    order_total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (order_status_id) REFERENCES order_status(order_status_id),
    FOREIGN KEY (shipping_service_id) REFERENCES shipping_services(shipping_service_id),
    FOREIGN KEY (order_type_id) REFERENCES order_types(order_type_id)
);

CREATE TABLE product_orders (
    order_id VARCHAR(10),
    product_id VARCHAR(10),
    product_quantity INT(6) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE postal_orders (
    order_id VARCHAR(10),
    parcel_id VARCHAR(10),
    total_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, parcel_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (parcel_id) REFERENCES parcels(parcel_id)
);

CREATE TABLE carriers (
    carrier_id VARCHAR(10) PRIMARY KEY,
    carrier_name VARCHAR(75) NOT NULL,
    shipping_service_id VARCHAR(10),
    carrier_contact_info TEXT,
    FOREIGN KEY (shipping_service_id) REFERENCES shipping_services(shipping_service_id)
);

CREATE TABLE shipments (
    shipment_id VARCHAR(10) UNIQUE,
    order_id VARCHAR(10) NOT NULL,
    carrier_id VARCHAR(10) NOT NULL,
    shipping_service_id VARCHAR(10),
    current_location TEXT,
    shipment_date TIMESTAMP,
    estimated_delivery_date DATE,
    shipment_status_id VARCHAR(10),
    PRIMARY KEY (order_id, carrier_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (carrier_id) REFERENCES carriers(carrier_id),
    FOREIGN KEY (shipping_service_id) REFERENCES shipping_services(shipping_service_id),
    FOREIGN KEY (shipment_status_id) REFERENCES shipment_status(shipment_status_id)
);

CREATE TABLE returns (
    return_id VARCHAR(10) PRIMARY KEY,
    order_id VARCHAR(10),
    return_reason TEXT NOT NULL,
    return_date DATE,
    return_status_id VARCHAR(10),
    FOREIGN KEY (return_status_id) REFERENCES return_status(return_status_id)
);

CREATE TABLE employees (
    employee_id VARCHAR(10) PRIMARY KEY,
    employee_first_name VARCHAR(75) NOT NULL,
    employee_last_name VARCHAR(75) NOT NULL,
    contact_info VARCHAR(75) NOT NULL,
    employee_role_id VARCHAR(10),
    employee_salary DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (employee_role_id) REFERENCES employee_roles(employee_role_id)
);

CREATE TABLE warehouse_employees (
    warehouse_id VARCHAR(10) NOT NULL,
    employee_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (warehouse_id, employee_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- log tables --

CREATE TABLE order_logs (
    order_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_id VARCHAR(10),
    order_log_description TEXT
);

CREATE TABLE customer_logs (
    customer_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id VARCHAR(10),
    customer_log_description TEXT
);

CREATE TABLE shipment_logs (
    shipment_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipment_id VARCHAR(10),
    shipment_log_description TEXT
);

CREATE TABLE return_logs (
    return_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_id VARCHAR(10),
    return_log_description TEXT
);

CREATE TABLE product_inventory_logs (
    product_inventory_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_id VARCHAR(10),
    warehouse_id VARCHAR(10),
    product_inventory_log_description TEXT
);

CREATE TABLE parcel_inventory_logs (
    parcel_inventory_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parcel_id VARCHAR(10),
    warehouse_id VARCHAR(10),
    parcel_inventory_log_description TEXT    
);

CREATE TABLE employee_logs (
    employee_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id VARCHAR(10),
    employee_log_description TEXT
);

CREATE TABLE warehouse_logs (
    warehouse_log_id VARCHAR(10) PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    warehouse_id VARCHAR(10),
    warehouse_log_description TEXT
);

-- archive tables --

CREATE TABLE shipment_archives (
    archive_id VARCHAR(10) PRIMARY KEY,
    shipment_id VARCHAR(10) NOT NULL,  -- Original shipment ID
    order_id VARCHAR(10),
    carrier_id VARCHAR(10),
    shipping_service_id VARCHAR(10),
    shipping_address TEXT,
    shipment_date TIMESTAMP,
    estimated_delivery_date DATE,
    shipment_status_id VARCHAR(10),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parcel_archives (
    archive_id VARCHAR(10) PRIMARY KEY,
    parcel_id VARCHAR(10) NOT NULL,  -- Original parcel ID
    parcel_category_id VARCHAR(10),
    parcel_weight DECIMAL(10, 2),
    parcel_description TEXT,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_archives (
    archive_id VARCHAR(10) PRIMARY KEY,
    product_id VARCHAR(10) NOT NULL,  -- Original product ID
    product_name VARCHAR(255),
    product_category_id VARCHAR(10),
    product_weight DECIMAL(10, 2),
    product_length DECIMAL(10, 2),
    product_width DECIMAL(10, 2),
    product_height DECIMAL(10, 2),
    product_supplier VARCHAR(255),
    product_unit_price DECIMAL(10, 2),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_archives (
    archive_id VARCHAR(10) PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL,  -- Original order ID
    customer_id VARCHAR(10),
    order_date_time TIMESTAMP,
    order_status_id VARCHAR(10),
    shipping_address TEXT,
    shipping_receiver VARCHAR(255),
    shipping_service_id VARCHAR(10),
    order_total_amount DECIMAL(10, 2),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_archives (
    archive_id VARCHAR(10) PRIMARY KEY,
    employee_id VARCHAR(10) NOT NULL,  -- Original employee ID
    employee_first_name VARCHAR(255),
    employee_last_name VARCHAR(255),
    contact_info TEXT,
    employee_role_id VARCHAR(10),
    employee_salary DECIMAL(10, 2),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_archives (
    archive_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,  -- Original customer ID
    customer_first_name VARCHAR(255),
    customer_last_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_address TEXT,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouse_archives (
    archive_id VARCHAR(10) PRIMARY KEY,
    warehouse_id VARCHAR(10) NOT NULL,  -- Original warehouse ID
    warehouse_address TEXT,
    capacity DECIMAL(10, 2),
    warehouse_type_id VARCHAR(10),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
