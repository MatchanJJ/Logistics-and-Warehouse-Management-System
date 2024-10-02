import pool from "./DBConnection.js";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Middleware to parse request bodies (if you're handling form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory and view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

const carrierPartnerTokens = {
    addCarrierPartner,
    updateLogisticsPartner,
    viewLogisticsPartner,
    deleteLogisticsPartner,
    listAllLogisticsPartners
}

// ADD NEW PARTNER
async function addCarrierPartner(carrier_id, carrier_name, shipping_service_id, carrier_contact_info) {
    try {
        const [result] = await pool.query(
            "INSERT INTO carriers (carrier_id, carrier_name, shipping_service_id, carrier_contact_info) VALUES (?, ?, ?, ?)", 
            [carrier_id, carrier_name, shipping_service_id, carrier_contact_info]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// UPDATING LOGISTIC PARTNER
async function updateLogisticsPartner(carrier_name, shipping_service_id, carrier_contact_info, carrier_id) {
    try {
        const [result] = await pool.query(
            "UPDATE carriers SET carrier_name = ?, shipping_service_id = ?, carrier_contact_info = ? WHERE carrier_id = ?", 
            [carrier_name, shipping_service_id, carrier_contact_info, carrier_id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// VIEWING A PARTNER
async function viewLogisticsPartner(carrier_id) {
    try {
        const [rows] = await pool.query("SELECT * FROM carriers WHERE carrier_id = ?", [carrier_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
}

// REMOVE A PARTNER
async function deleteLogisticsPartner(carrier_id) {
    try {
        const [result] = await pool.query("DELETE FROM carriers WHERE carrier_id = ?", [carrier_id]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

// LIST ALL PARTNERS
async function listAllLogisticsPartners() {
    try {
        const [rows] = await pool.query("SELECT * FROM carriers");
        return rows;
    } catch (error) {
        throw error;
    }
}

// ROUTES
app.get('/', async (req, res) => {
    try {
        const partners = await listAllLogisticsPartners();
        res.render('index', { partners });  // Renders the main page with a list of all partners
    } catch (error) {
        res.status(500).send('Error fetching logistics partners.');
    }
});

app.get('/partner/:id', async (req, res) => {
    try {
        const partner = await viewLogisticsPartner(req.params.id);
        if (partner) {
            res.render('partner', { partner });
        } else {
            res.status(404).send('Logistics partner not found.');
        }
    } catch (error) {
        res.status(500).send('Error fetching logistics partner.');
    }
});

// FORM TO ADD NEW PARTNER
app.get('/add-partner', (req, res) => {
    res.render('add-partner');
});

app.post('/add-partner', async (req, res) => {
    const { carrier_id, carrier_name, shipping_service_id, carrier_contact_info } = req.body;
    try {
        await addCarrierPartner(carrier_id, carrier_name, shipping_service_id, carrier_contact_info);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding new partner.');
    }
});

// FORM TO UPDATE PARTNER
app.get('/update-partner/:id', async (req, res) => {
    try {
        const partner = await viewLogisticsPartner(req.params.id);
        if (partner) {
            res.render('update-partner', { partner });
        } else {
            res.status(404).send('Logistics partner not found.');
        }
    } catch (error) {
        res.status(500).send('Error fetching logistics partner.');
    }
});

app.post('/update-partner/:id', async (req, res) => {
    const { carrier_name, shipping_service_id, carrier_contact_info } = req.body;
    const { id } = req.params;
    try {
        await updateLogisticsPartner(carrier_name, shipping_service_id, carrier_contact_info, id);
        res.redirect(`/partner/${id}`);
    } catch (error) {
        res.status(500).send('Error updating partner.');
    }
});

// DELETE A PARTNER
app.post('/delete-partner/:id', async (req, res) => {
    try {
        await deleteLogisticsPartner(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting partner.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default carrierPartnerTokens;