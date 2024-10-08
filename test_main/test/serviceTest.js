//import CarrierService from '../services/CarrierService.js';
import LogService from '../services/LogService.js';
//import CustomerService from '../services/CustomerService.js';
//import EmployeeService from '../services/EmployeeService.js';
import InventoryService from '../services/InventoryService.js';
//import ParcelService from '../services/ParcelService.js';
import ProductService from '../services/ProductService.js';


//await ProductService.addProduct('PC1', 'A4 OPPO', 'OPPO', 'OPPO inc', 'Solid Phone stats etc', 12000, 0.1, 10, 10, 3, 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'TRUE', 'FALSE');

await ProductService.removeProduct('PRDLoH3yDe');

console.log(InventoryService.getInventory());
console.log(ProductService.getProducts());
//console.log(LogService.getParcelInventoryLogs());
console.log(LogService.getProductInventoryLogs());