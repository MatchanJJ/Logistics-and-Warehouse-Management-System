import express from 'express';
import test_functions from './Function_Test_ch.js';

const app = express();
const port = 3000;

var tables = test_functions.getTables();
console.log(test_functions.helloWorld());
console.log(tables);
for (x in tables) {
    console.log(x);
}

