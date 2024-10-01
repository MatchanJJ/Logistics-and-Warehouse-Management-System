-- Populating warehouses
INSERT INTO warehouses (warehouse_id, warehouse_address, capacity, warehouse_type_id) VALUES
('WHR0000001', '123 Main St, City A', 50000.00, 'WTY0000002'),
('WHR0000002', '456 Market Rd, City B', 30000.00, 'WTY0000001'),
('WHR0000003', '789 Industrial Ave, City C', 45000.00, 'WTY0000003'),
('WHR0000004', '101 State Hwy, City D', 70000.00, 'WTY0000003'),
('WHR0000005', '234 Village Ln, City E', 20000.00, 'WTY0000002');

-- Populating warehouse_locations
INSERT INTO warehouse_locations (warehouse_location_id, warehouse_id, section, aisle, rack, shelf, bin) VALUES
('WLO0000001', 'WHR0000001', 'A', '1', 'R1', 'S1', 'B1'),
('WLO0000002', 'WHR0000002', 'B', '2', 'R2', 'S2', 'B2'),
('WLO0000003', 'WHR0000003', 'C', '3', 'R3', 'S3', 'B3'),
('WLO0000004', 'WHR0000004', 'D', '4', 'R4', 'S4', 'B4'),
('WLO0000005', 'WHR0000005', 'E', '5', 'R5', 'S5', 'B5');

-- Populating products
INSERT INTO products (product_id, product_category_id, product_name, product_brand, product_supplier, product_description, product_unit_price, product_weight, product_length, product_width, product_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) VALUES
('PRD0000001', 'PCT0000001', 'Smartphone', 'TechBrand', 'Supplier A', 'Latest model smartphone with advanced features.', 599.99, 0.20, 15.00, 7.00, 0.75, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PRD0000002', 'PCT0000002', 'T-shirt', 'FashionBrand', 'Supplier B', '100% cotton t-shirt.', 19.99, 0.10, 30.00, 20.00, 0.50, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PRD0000003', 'PCT0000003', 'Coffee Maker', 'HomeBrand', 'Supplier C', '12-cup programmable coffee maker.', 49.99, 3.00, 30.00, 20.00, 25.00, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PRD0000004', 'PCT0000004', 'Novel Book', 'BooksBrand', 'Supplier D', 'Bestselling novel.', 12.99, 0.50, 20.00, 15.00, 2.00, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PRD0000005', 'PCT0000005', 'Office Chair', 'OfficeBrand', 'Supplier E', 'Ergonomic office chair with lumbar support.', 159.99, 12.00, 90.00, 60.00, 100.00, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE);

-- Populating parcels
INSERT INTO parcels (parcel_id, parcel_category_id, parcel_description, parcel_unit_price, parcel_weight, parcel_length, parcel_width, parcel_height, is_fragile, is_perishable, is_hazardous, is_oversized, is_returnable, is_temperature_sensitive) VALUES
('PAR0000001', 'PCT0000003', 'Small box of electronics.', 9.99, 0.75, 25.00, 20.00, 10.00, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PAR0000002', 'PCT0000004', 'Medium parcel containing books.', 14.99, 3.50, 40.00, 30.00, 20.00, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PAR0000003', 'PCT0000005', 'Large parcel with office supplies.', 19.99, 7.00, 60.00, 40.00, 30.00, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PAR0000004', 'PCT0000006', 'Registered mail containing documents.', 4.99, 0.25, 20.00, 15.00, 2.00, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE),
('PAR0000005', 'PCT0000007', 'Oversized parcel with furniture.', 29.99, 25.00, 150.00, 100.00, 100.00, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE);

-- Populating product_inventories
INSERT INTO product_inventories (product_inventory_id, warehouse_id, warehouse_location_id, product_id, quantity, total_volume) VALUES
('PRI0000001', 'WHR0000001', 'WLO0000001', 'PRD0000001', 100, 105.00),
('PRI0000002', 'WHR0000002', 'WLO0000002', 'PRD0000002', 250, 300.00),
('PRI0000003', 'WHR0000003', 'WLO0000003', 'PRD0000003', 50, 250.00),
('PRI0000004', 'WHR0000004', 'WLO0000004', 'PRD0000004', 500, 200.00),
('PRI0000005', 'WHR0000005', 'WLO0000005', 'PRD0000005', 30, 720.00);

-- Populating parcel_inventories
INSERT INTO parcel_inventories (parcel_inventory_id, warehouse_id, warehouse_location_id, parcel_id, quantity, total_volume) VALUES
('PIN0000001', 'WHR0000001', 'WLO0000001', 'PAR0000001', 100, 50.00),
('PIN0000002', 'WHR0000002', 'WLO0000002', 'PAR0000002', 200, 100.00),
('PIN0000003', 'WHR0000003', 'WLO0000003', 'PAR0000003', 75, 210.00),
('PIN0000004', 'WHR0000004', 'WLO0000004', 'PAR0000004', 500, 12.50),
('PIN0000005', 'WHR0000005', 'WLO0000005', 'PAR0000005', 25, 375.00);

-- Populating customers
INSERT INTO customers (customer_id, customer_first_name, customer_last_name, customer_email, customer_address) VALUES
('CUS0000001', 'John', 'Doe', 'john.doe@example.com', '123 Elm St, City A'),
('CUS0000002', 'Jane', 'Smith', 'jane.smith@example.com', '456 Oak Ave, City B'),
('CUS0000003', 'Michael', 'Johnson', 'michael.johnson@example.com', '789 Pine Rd, City C'),
('CUS0000004', 'Emily', 'Davis', 'emily.davis@example.com', '101 Maple Ln, City D'),
('CUS0000005', 'David', 'Brown', 'david.brown@example.com', '234 Birch Blvd, City E');

-- Populating orders
INSERT INTO orders (order_id, customer_id, order_date_time, order_status_id, shipping_service_id, shipping_address, shipping_receiver, order_type_id, order_total_amount) VALUES
('ORD0000001', 'CUS0000001', '2024-10-01 08:30:00', 'OST0000001', 'SSV0000001', '123 Elm St, City A', 'John Doe', 'OTY0000002', 619.98),
('ORD0000002', 'CUS0000002', '2024-10-01 09:00:00', 'OST0000002', 'SSV0000002', '456 Oak Ave, City B', 'Jane Smith', 'OTY0000001', 34.98),
('ORD0000003', 'CUS0000003', '2024-10-01 10:00:00', 'OST0000001', 'SSV0000001', '789 Pine Rd, City C', 'Michael Johnson', 'OTY0000002', 159.99),
('ORD0000004', 'CUS0000004', '2024-10-01 11:00:00', 'OST0000003', 'SSV0000003', '101 Maple Ln, City D', 'Emily Davis', 'OTY0000002', 49.99),
('ORD0000005', 'CUS0000005', '2024-10-01 12:00:00', 'OST0000004', 'SSV0000001', '234 Birch Blvd, City E', 'David Brown', 'OTY0000001', 59.99);

-- Populating product_orders
INSERT INTO product_orders (product_order_id, order_id, product_id, product_quantity, product_unit_price, total_price) VALUES
('POD0000001', 'ORD0000001', 'PRD0000001', 2, 599.99, 1199.98),
('POD0000002', 'ORD0000002', 'PRD0000002', 1, 19.99, 19.99),
('POD0000003', 'ORD0000003', 'PRD0000003', 1, 49.99, 49.99),
('POD0000004', 'ORD0000004', 'PRD0000004', 1, 12.99, 12.99),
('POD0000005', 'ORD0000005', 'PRD0000005', 1, 159.99, 159.99);

-- Populating postal_orders
INSERT INTO postal_orders (postal_order_id, order_id, parcel_id, total_price) VALUES
('POL0000001', 'ORD0000002', 'PAR0000001', 9.99),
('POL0000002', 'ORD0000005', 'PAR0000003', 29.99),
('POL0000003', 'ORD0000003', 'PAR0000002', 14.99),
('POL0000004', 'ORD0000004', 'PAR0000004', 4.99),
('POL0000005', 'ORD0000001', 'PAR0000005', 29.99);

-- Populating carriers
INSERT INTO carriers (carrier_id, carrier_name, shipping_service_id, carrier_contact_info) VALUES
('CAR0000001', 'Carrier A', 'SSV0000001', 'contact@carriera.com'),
('CAR0000002', 'Carrier B', 'SSV0000002', 'contact@carrierb.com'),
('CAR0000003', 'Carrier C', 'SSV0000003', 'contact@carrierc.com'),
('CAR0000004', 'Carrier D', 'SSV0000001', 'contact@carrierd.com'),
('CAR0000005', 'Carrier E', 'SSV0000002', 'contact@carriere.com');

-- Populating shipments
INSERT INTO shipments (shipment_id, order_id, carrier_id, shipping_service_id, shipping_address, shipment_date, estimated_delivery_date, shipment_status_id) VALUES
('SHP0000001', 'ORD0000001', 'CAR0000001', 'SSV0000001', '123 Elm St, City A', '2024-10-01 08:45:00', '2024-10-03', 'SST0000001'),
('SHP0000002', 'ORD0000002', 'CAR0000002', 'SSV0000002', '456 Oak Ave, City B', '2024-10-01 09:15:00', '2024-10-02', 'SST0000002'),
('SHP0000003', 'ORD0000003', 'CAR0000003', 'SSV0000001', '789 Pine Rd, City C', '2024-10-01 10:30:00', '2024-10-04', 'SST0000001'),
('SHP0000004', 'ORD0000004', 'CAR0000004', 'SSV0000003', '101 Maple Ln, City D', '2024-10-01 11:30:00', '2024-10-01', 'SST0000003'),
('SHP0000005', 'ORD0000005', 'CAR0000005', 'SSV0000002', '234 Birch Blvd, City E', '2024-10-01 12:15:00', '2024-10-03', 'SST0000001');

-- Populating returns
INSERT INTO returns (return_id, order_id, return_reason, return_date, return_status_id) VALUES
('RET0000001', 'ORD0000001', 'Item damaged during shipping', '2024-10-05', 'RST0000001'),
('RET0000002', 'ORD0000002', 'Incorrect item shipped', '2024-10-06', 'RST0000002'),
('RET0000003', 'ORD0000003', 'Changed mind', '2024-10-07', 'RST0000003'),
('RET0000004', 'ORD0000004', 'Product defect', '2024-10-08', 'RST0000002'),
('RET0000005', 'ORD0000005', 'Size issue', '2024-10-09', 'RST0000001');

-- Populating employees
INSERT INTO employees (employee_id, employee_first_name, employee_last_name, contact_info, employee_role_id, employee_salary) VALUES
('EMP0000001', 'Alice', 'Johnson', 'alice.johnson@example.com', 'ERO0000001', 35000.00),
('EMP0000002', 'Bob', 'Williams', 'bob.williams@example.com', 'ERO0000002', 32000.00),
('EMP0000003', 'Charlie', 'Brown', 'charlie.brown@example.com', 'ERO0000003', 30000.00),
('EMP0000004', 'Diana', 'Moore', 'diana.moore@example.com', 'ERO0000004', 45000.00),
('EMP0000005', 'Edward', 'Taylor', 'edward.taylor@example.com', 'ERO0000005', 40000.00);
