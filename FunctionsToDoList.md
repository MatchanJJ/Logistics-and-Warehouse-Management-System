FUNCTION CLASSES:

[1] Warehouse Management  - DONE
       Add Warehouse: Function to add a new warehouse to the system.
       Update Warehouse Capacity: Update the capacity when packages are added or removed from the warehouse.
       Remove Warehouse: Functions to remove a warehouse if inventory level = 0.
       Check Available Capacity: Function to view available capacity in a warehouse. 

[2] Product Management  - DONE
       Register New Product: Insert a new product into the system and assign it to a warehouse.
       Update Product Details: Modify product information, such as weight, dimensions, and status.
       Remove Product: Function to remove a registered product. -PENDING / needed complex func

[3] Parcel Management -DONE
       Add New Parcel: Every postal order or every return, add a new parcel into the system amd assign it to a warehouse.
       Update Parcel Details: Modify parcel information. 
       Remove Parcel: For every successful processing of parcel, it is removed from the warehouse the moment it is shipped.
       -PENDING / needed complex func

[4] Employee Management -DONE
       Add New Employee: Insert a new employee into the system. 
       Assign Job Role: Assign roles (e.g., manager, delivery personnel) to employees. 
       Manage Employee Details: View and update employee information, such as contact details and address.
       Add New Employee Roles: Ability to add or remove job roles.

[5] Carrier Partner Management  - DONE
       Add Carrier Partner: Function to add a new logistics partner (e.g., courier service) to the system.
       Update Carrier Information: Ability to update logistics partner details like service area and contact information.

[6] Order Management  -DONE
       Generate Orders: Function to add new orders [ e-commerce or postal ]. -PENDING
       Update Order Information: Ability to update orders like order status. 

[7] Shipment Management  -DONE
       Create Shipment Record: Register a new shipment with its order details.
       Track Shipment Status: Track the status of shipments.

[8] Status and Categories Management  -DONE/PARTIAL
       Define Categories and Status: Insert, update or define status and categories.
       
[9] Logging - DONE
       Log Functions: Logs every action for every function action.
       - PENDING -
       ADD THE LOG FUNCTION TO EVERY ACTION IN THE EJS ROUTINGS OF THAT PARTICULAR FUNCTIONS
       - SEE OrderManagement.js line 113 :))))
