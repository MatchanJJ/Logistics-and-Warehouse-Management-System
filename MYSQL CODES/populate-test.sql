INSERT INTO warehouses (id, location, capacity)
VALUES
('WH001', 'Manila', 1000),
('WH002', 'Cebu', 1200),
('WH003', 'Davao', 1500),
('WH004', 'Makati', 900),
('WH005', 'Quezon City', 1100);
INSERT INTO employee (id, first_name, last_name, contact_info, address)
VALUES
('EMP001', 'John', 'Doe', '09171234567', 'Manila'),
('EMP002', 'Jane', 'Smith', '09281234568', 'Cebu'),
('EMP003', 'Mark', 'Johnson', '09391234569', 'Davao'),
('EMP004', 'Emily', 'Davis', '09181234560', 'Makati'),
('EMP005', 'Michael', 'Brown', '09291234561', 'Quezon City');
INSERT INTO job_roles (id, description)
VALUES
('ROLE001', 'Warehouse Manager'),
('ROLE002', 'Inventory Specialist'),
('ROLE003', 'Logistics Coordinator'),
('ROLE004', 'Delivery Driver'),
('ROLE005', 'Pickup Manager');
INSERT INTO package (id, weight, dimensions, type, origin, destination, tracking_number, description)
VALUES
('PKG001', 2.50, '30x20x10 cm', 'Electronics', 'Manila', 'Cebu', 'TRK123456', 'Laptop'),
('PKG002', 1.75, '20x15x10 cm', 'Books', 'Cebu', 'Davao', 'TRK123457', 'Textbooks'),
('PKG003', 5.00, '50x40x30 cm', 'Furniture', 'Davao', 'Makati', 'TRK123458', 'Chair'),
('PKG004', 0.50, '10x10x5 cm', 'Jewelry', 'Makati', 'Manila', 'TRK123459', 'Ring'),
('PKG005', 3.00, '40x30x20 cm', 'Clothing', 'Quezon City', 'Manila', 'TRK123460', 'Apparel');
INSERT INTO weight_class (category, min_weight, max_weight)
VALUES
('Blah', 0.00, 1.00),
('Blah', 1.01, 3.00),
('Blah', 3.01, 5.00),
('Damn', 5.01, 10.00),
('Damn', 10.01, 20.00);
INSERT INTO logistics_partner (id, name, contact_info, address, service_area)
VALUES
('LP001', 'FastTrack Delivery', '09191234562', 'Manila', 'Luzon'),
('LP002', 'QuickShip Logistics', '09291234563', 'Cebu', 'Visayas'),
('LP003', 'RapidCargo', '09391234564', 'Davao', 'Mindanao'),
('LP004', 'ExpressLine', '09101234565', 'Makati', 'Luzon'),
('LP005', 'Global Freight', '09201234566', 'Quezon City', 'Nationwide');
INSERT INTO deliveries (id, delivery_date, logistics_partner_id, package_id, warehouse_id)
VALUES
('DEL001', '2023-09-18 10:30:00', 'LP001', 'PKG001', 'WH001'),
('DEL002', '2023-09-18 12:00:00', 'LP002', 'PKG002', 'WH002'),
('DEL003', '2023-09-18 15:30:00', 'LP003', 'PKG003', 'WH003'),
('DEL004', '2023-09-18 17:00:00', 'LP004', 'PKG004', 'WH004'),
('DEL005', '2023-09-18 18:30:00', 'LP005', 'PKG005', 'WH005');
INSERT INTO pickup (id, pickup_date, logistics_partner_id, package_id, warehouse_id)
VALUES
('PCK001', '2023-09-17 09:00:00', 'LP001', 'PKG001', 'WH001'),
('PCK002', '2023-09-17 11:00:00', 'LP002', 'PKG002', 'WH002'),
('PCK003', '2023-09-17 14:00:00', 'LP003', 'PKG003', 'WH003'),
('PCK004', '2023-09-17 16:00:00', 'LP004', 'PKG004', 'WH004'),
('PCK005', '2023-09-17 18:00:00', 'LP005', 'PKG005', 'WH005');
INSERT INTO shipment (id, status, pickup_id, delivery_id, package_id)
VALUES
('SHP001', 'In Transit', 'PCK001', 'DEL001', 'PKG001'),
('SHP002', 'In Transit', 'PCK002', 'DEL002', 'PKG002'),
('SHP003', 'Delivered', 'PCK003', 'DEL003', 'PKG003'),
('SHP004', 'In Transit', 'PCK004', 'DEL004', 'PKG004'),
('SHP005', 'Delivered', 'PCK005', 'DEL005', 'PKG005');
INSERT INTO warehouse_inventory (id, warehouse_id, package_id)
VALUES
('WI001', 'WH001', 'PKG001'),
('WI002', 'WH002', 'PKG002'),
('WI003', 'WH003', 'PKG003'),
('WI004', 'WH004', 'PKG004'),
('WI005', 'WH005', 'PKG005');
INSERT INTO warehouse_management (id, employee_id, role_id, warehouse_id)
VALUES
('WM001', 'EMP001', 'ROLE001', 'WH001'),
('WM002', 'EMP002', 'ROLE002', 'WH002'),
('WM003', 'EMP003', 'ROLE003', 'WH003'),
('WM004', 'EMP004', 'ROLE004', 'WH004'),
('WM005', 'EMP005', 'ROLE005', 'WH005');
