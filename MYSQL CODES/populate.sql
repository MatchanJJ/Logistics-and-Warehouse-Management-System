-- Populating warehouse_types
INSERT INTO warehouse_types (warehouse_type_id, warehouse_type_name) VALUES 
('WT001', 'postal'),
('WT002', 'e-commerce'),
('WT003', 'both');

-- Populating order_status
INSERT INTO order_status (order_status_id, order_status_name) VALUES 
('OS001', 'pending'),
('OS002', 'picked'),
('OS003', 'shipped');

-- Populating shipment_status
INSERT INTO shipment_status (shipment_status_id, shipment_status_name) VALUES 
('SS001', 'pending'),
('SS002', 'in-transit'),
('SS003', 'delivered');

-- Populating order_types
INSERT INTO order_types (order_type_id, order_type_name) VALUES 
('OT001', 'postal'),
('OT002', 'e-commerce');

-- Populating return_status
INSERT INTO return_status (return_status_id, return_status_name) VALUES 
('RS001', 'pending'),
('RS002', 'processed'),
('RS003', 'returned');

-- Populating employee_roles
INSERT INTO employee_roles (employee_role_id, role_name) VALUES 
('ER001', 'picker'),
('ER002', 'packaging'),
('ER003', 'security');

-- Populating warehouses
INSERT INTO warehouses (warehouse_id, warehouse_address, capacity, warehouse_type_id) VALUES 
('WH001', '123 Main St, City A', 5000, 'WT001'),
('WH002', '456 Oak Ave, City B', 3000, 'WT002');

-- Populating warehouse_locations
INSERT INTO warehouse_locations (warehouse_location_id, warehouse_id, section, aisle, rack, shelf, bin) VALUES 
('WL001', 'WH001', 'Section A', 'Aisle 1', 'Rack 1', 'Shelf 1', 'Bin 1'),
('WL002', 'WH002', 'Section B', 'Aisle 2', 'Rack 2', 'Shelf 2', 'Bin 2');

-- Populating product_categories
INSERT INTO product_categories (product_category_id, product_category_name) VALUES 
('PC001', 'electronics'),
('PC002', 'apparel');

-- Populating parcel_categories
INSERT INTO parcel_categories (parcel_category_id, parcel_category_name) VALUES 
('PA001', 'small parcel'),
('PA002', 'large parcel');

-- Populating products
INSERT INTO products (product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile) VALUES 
('P001', 'PC001', 'Smartphone', 'BrandX', 'SupplierX', 'Latest model', 10.50, 0.5, 5.0, 2.5, 0.7, TRUE),
('P002', 'PC002', 'T-shirt', 'BrandY', 'SupplierY', 'Cotton shirt', 5.00, 0.2, 10.0, 8.0, 1.0, FALSE);

-- Populating parcels
INSERT INTO parcels (parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile) VALUES 
('PA001', 'PA001', 'Small parcel containing documents', 2.00, 0.2, 10.0, 5.0, 1.0, FALSE),
('PA002', 'PA002', 'Large parcel containing books', 8.00, 2.0, 30.0, 20.0, 10.0, TRUE);

-- Populating product_inventories
INSERT INTO product_inventories (product_id, warehouse_id, warehouse_location_id, quantity, total_volume) VALUES 
('P001', 'WH001', 'WL001', 100, 250),
('P002', 'WH002', 'WL002', 200, 500);

-- Populating parcel_inventories
INSERT INTO parcel_inventories (parcel_id, warehouse_id, warehouse_location_id, quantity, total_volume) VALUES 
('PA001', 'WH001', 'WL001', 50, 100),
('PA002', 'WH002', 'WL002', 30, 200);

-- Populating customers
INSERT INTO customers (customer_id, customer_first_name, customer_last_name, customer_email, customer_address) VALUES 
('C001', 'John', 'Doe', 'johndoe@example.com', '789 Elm St, City C'),
('C002', 'Jane', 'Smith', 'janesmith@example.com', '321 Pine St, City D');

-- Populating shipping_services
INSERT INTO shipping_services (shipping_service_id, shipping_service_name) VALUES 
('SS001', 'standard'),
('SS002', 'express');

-- Populating orders
INSERT INTO orders (order_id, customer_id, order_date_time, order_status_id, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount) VALUES 
('O001', 'C001', NOW(), 'OS001', 'SS001', '789 Elm St, City C', 'John Doe', 'OT001', 150.00),
('O002', 'C002', NOW(), 'OS002', 'SS002', '321 Pine St, City D', 'Jane Smith', 'OT002', 200.00);

-- Populating product_orders
INSERT INTO product_orders (order_id, product_id, product_quantity, total_price) VALUES 
('O001', 'P001', 2, 21.00),
('O002', 'P002', 3, 15.00);

-- Populating postal_orders
INSERT INTO postal_orders (order_id, parcel_id, total_price) VALUES 
('O001', 'PA001', 2.00),
('O002', 'PA002', 8.00);

-- Populating carriers
INSERT INTO carriers (carrier_id, carrier_name, shipping_service_id, carrier_contact_info) VALUES 
('CAR001', 'CarrierX', 'SS001', 'contact@carrierx.com'),
('CAR002', 'CarrierY', 'SS002', 'info@carriery.com');

-- Populating shipments
INSERT INTO shipments (shipment_id, order_id, carrier_id, shipping_service_id, current_location, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) VALUES 
('S001', 'O001', 'CAR001', 'SS001', 'City A', '789 Elm St, City C', NOW(), NOW() + INTERVAL 5 DAY, 'SS001'),
('S002', 'O002', 'CAR002', 'SS002', 'City B', '321 Pine St, City D', NOW(), NOW() + INTERVAL 3 DAY, 'SS002');

-- Populating returns
INSERT INTO returns (return_id, order_id, return_reason, return_date, return_status_id) VALUES 
('R001', 'O001', 'Damaged product', NOW(), 'RS001'),
('R002', 'O002', 'Incorrect item', NOW(), 'RS002');

-- Populating employees
INSERT INTO employees (employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) VALUES 
('E001', 'Alice', 'Johnson', 'alice@example.com', 'ER001', 3000.00),
('E002', 'Bob', 'Lee', 'bob@example.com', 'ER002', 3500.00);

-- Populating warehouse_employees
INSERT INTO warehouse_employees (warehouse_id, employee_id) VALUES 
('WH001', 'E001'),
('WH002', 'E002');

-- Populating logs (for example purposes, adding one for each log table)
INSERT INTO order_logs (order_log_id, order_id, order_log_description) VALUES 
('OL001', 'O001', 'Order created');
INSERT INTO customer_logs (customer_log_id, customer_id, customer_log_description) VALUES 
('CL001', 'C001', 'Customer created');
INSERT INTO shipment_logs (shipment_log_id, shipment_id, shipment_log_description) VALUES 
('SL001', 'S001', 'Shipment dispatched');
INSERT INTO return_logs (return_log_id, return_id, return_log_description) VALUES 
('RL001', 'R001', 'Return initiated');
INSERT INTO product_inventory_logs (product_inventory_log_id, product_id, warehouse_id, product_inventory_log_description) VALUES 
('PIL001', 'P001', 'WH001', 'Inventory added');
INSERT INTO parcel_inventory_logs (parcel_inventory_log_id, parcel_id, warehouse_id, parcel_inventory_log_description) VALUES 
('PIL002', 'PA001', 'WH001', 'Inventory added');
INSERT INTO employee_logs (employee_log_id, employee_id, employee_log_description) VALUES 
('EL001', 'E001', 'Employee hired');
INSERT INTO warehouse_logs (warehouse_log_id, warehouse_id, warehouse_log_description) VALUES 
('WL001', 'WH001', 'Warehouse opened');

-- Populating archive tables (archive sample for shipments)
INSERT INTO shipment_archives (archive_id, shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) VALUES 
('A001', 'S001', 'O001', 'CAR001', 'SS001', '789 Elm St, City C', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 25 DAY, 'SS003');
