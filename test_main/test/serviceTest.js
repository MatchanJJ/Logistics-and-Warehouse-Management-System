//import CarrierService from '../services/CarrierService.js';
import LogService from '../services/LogService.js';
//import CustomerService from '../services/CustomerService.js';
//import EmployeeService from '../services/EmployeeService.js';
import InventoryService from '../services/InventoryService.js';
import ParcelService from '../services/ParcelService.js';
import ProductService from '../services/ProductService.js';
import WarehouseServices from '../services/WarehouseServices.js';
import StatAndCatService from '../services/StatusAndCategoriesService.js';

//await ProductService.addProduct('PC1', 'A4 OPPO', 'OPPO', 'OPPO inc', 'Solid Phone stats etc', 12000, 0.1, 10, 10, 3, 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'TRUE', 'FALSE');

//await InventoryService.assignProduct('P002', )

//console.log(InventoryService.getInventory());
//console.log(ProductService.getProducts());
//console.log(LogService.getParcelInventoryLogs());
//console.log(LogService.getProductInventoryLogs());

//console.log(WarehouseServices.isFull('W001'));

//console.log(WarehouseServices.isEmpty('WHR0DPvVDa'));
//console.log(WarehouseServices.isEmpty('W001'));
//await ParcelService.addParcel('PCT0000003', 'Box of Dildos', 600, 0.5, 10, 10, 10, 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE');


await StatAndCatService.addParcelCategory('erotica');
console.log(await StatAndCatService.getParcelCategories());