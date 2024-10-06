// imports for routing
import path from 'path';
import { fileURLToPath } from 'url';
import pool from "./DBconnection/DBConnection.js";
import express from 'express';

// get __filename and __direname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initialize express
const app = express();
const port = 3003;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.body); // Log incoming request body
    next();
});

// Middleware to parse request bodies (for POST requests)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../../public'))); // Serve static files

// Set the views directory and view engine
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');

// Home route (blank or simple welcome message)
app.get('/', (req, res) => {
    res.render('layout', {
        title: 'Home',
        content: 'home'  // Render the blank home page
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
