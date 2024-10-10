-- Populating warehouse_types
INSERT INTO warehouse_types (warehouse_type_id, warehouse_type_name) VALUES
('WTY0000001', 'postal'),
('WTY0000002', 'e-commerce'),
('WTY0000003', 'both');

-- Populating order_status
INSERT INTO order_status (order_status_id, order_status_name) VALUES
('OST0000001', 'pending'),
('OST0000002', 'picked'),
('OST0000003', 'packed'),
('OST0000004', 'shipped'),
('OST0000005', 'delivered'),
('OST0000006', 'cancelled');

-- Populating shipment_status
INSERT INTO shipment_status (shipment_status_id, shipment_status_name) VALUES
('SST0000001', 'pending'),
('SST0000002', 'in-transit'),
('SST0000003', 'delivered'),
('SST0000004', 'failed'),
('SST0000005', 'returned');

-- Populating return_status
INSERT INTO return_status (return_status_id, return_status_name) VALUES
('RST0000001', 'pending'),
('RST0000002', 'processed'),
('RST0000003', 'returned'),
('RST0000004', 'cancelled');
m,
-- Populating employee_roles
INSERT INTO employee_roles (employee_role_id, role_name) VALUES
('ERO0000001', 'picker'),
('ERO0000002', 'packer'),+
('ERO0000003', 'security'),
('ERO0000004', 'management'),
('ERO0000005', 'driver'),
('ERO0000006', 'warehouse supervisor');

-- Populating product_categories
INSERT INTO product_categories (product_category_id, product_category_name) VALUES
('PCT0000001', 'electronics'),
('PCT0000002', 'apparel'),
('PCT0000003', 'home goods'),
('PCT0000004', 'books'),
('PCT0000005', 'office supplies'),
('PCT0000006', 'health & beauty');

-- Populating parcel_categories
INSERT INTO parcel_categories (parcel_category_id, parcel_category_name) VALUES
('PCT0000001', 'letters'),
('PCT0000002', 'documents'),
('PCT0000003', 'small parcel'),
('PCT0000004', 'medium parcel'),
('PCT0000005', 'large parcel'),
('PCT0000006', 'registered mail'),
('PCT0000007', 'oversized parcel');

-- Populating shipping_services
INSERT INTO shipping_services (shipping_service_id, shipping_service_name) VALUES
('SSV0000001', 'standard'),
('SSV0000002', 'express'),
('SSV0000003', 'overnight');
