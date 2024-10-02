import express from 'express';
import test_functions from './Function_Test_ch.js';

const app = express();
const port = 3000;

var tables = test_functions.getTables();
console.log(test_functions.helloWorld());
console.log(tables);
console.log(test_functions.getCustomers());
console.log(test_functions.getInventory());
console.log(test_functions.getOrders());
console.log(test_functions.getEmployees());

