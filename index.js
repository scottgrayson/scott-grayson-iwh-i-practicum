require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: display custom object records in a table
app.get('/', async (req, res) => {
    const apiUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,species,light_level`;
    try {
        const resp = await axios.get(apiUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Houseplants | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching custom objects');
    }
});

// ROUTE 2 - Form to create a new custom object record
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Handle form submission, create record, redirect home
app.post('/update-cobj', async (req, res) => {
    const apiUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const newRecord = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            light_level: req.body.light_level
        }
    };
    try {
        await axios.post(apiUrl, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating record');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));