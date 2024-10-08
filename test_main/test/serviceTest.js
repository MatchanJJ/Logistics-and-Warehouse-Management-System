//import CarrierService from '../services/CarrierService.js';
import LogService from '../services/LogService.js';
//import CustomerService from '../services/CustomerService.js';
//import EmployeeService from '../services/EmployeeService.js';
import InventoryService from '../services/InventoryService.js';
//import ParcelService from '../services/ParcelService.js';


await ParcelService.removeParcel('PAR_pfH31g');


console.log(InventoryService.getInventory());
console.log(LogService.getParcelInventoryLogs());
//console.log(LogService.getProductInventoryLogs());