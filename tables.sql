CREATE DATABASE warehouse_logistics_management;

CREATE TABLE warehouses (
    id VARCHAR(10) PRIMARY KEY
    location TEXT NOT NULL,
    capacity INT(6) NOT NULL,
)

CREATE TABLE warehouse_inventory (
    id VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (package_id) REFERENCES package(id)
)

CREATE TABLE warehouse_management (
    id VARCHAR(10) PRIMARY,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (role_id) REFERENCES job_roles(id)
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
)

CREATE TABLE employee (
    id VARCHAR(10) PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    address TEXT NOT NULL
)

CREATE TABLE job_roles (
    id VARCHAR(10) PRIMARY KEY,
    description TEXT NOT NULL
)

CREATE TABLE package (
    id VARCHAR(10) PRIMARY KEY,
    weight FLOAT(6,2) NOT NULL,
    dimensions TEXT,
    type TEXT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    tracking_number TEXT NOT NULL,
    description TEXT NOT NULL
)

CREATE TABLE weight_class (
    category ENUM('Blah', 'Damn'),
    weight_range TEXT
)

CREATE TABLE logistics_partner (
    id VARCHAR(10) PRIMARY KEY,
    name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    address TEXT NOT NULL,
    service_area TEXT NOT NULL
)

CREATE TABLE shipment (
    id VARCHAR(10) PRIMARY KEY,
    status TEXT NOT NULL,
    FOREIGN KEY (pickup_id) REFERENCES pickup(id),
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id),
    FOREIGN KEY (package_id) REFERENCES package(id) 
)

CREATE TABLE deliveries (
    id VARCHAR(10) PRIMARY KEY,
    delivery_date TIMESTAMP NOT NULL,
    FOREIGN KEY (logistics_partner_id) REFERENCES logistics_partner(id),
    FOREIGN KEY (package_id) REFERENCES package(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) 
)

CREATE TABLE pickup (
    id VARCHAR(10) PRIMARY KEY,
    pickup_date TIMESTAMP NOT NULL,
    FOREIGN KEY (logistics_partner_id) REFERENCES logistics_partner(id),
    FOREIGN KEY (package_id) REFERENCES package(id), 
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
)