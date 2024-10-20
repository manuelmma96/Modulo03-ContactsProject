/*
TEST ALL ROUTES WITHIN 4 CATEGORIES ARE WORKING AS EXPECTED.
TEST  ID VALIDATION TO ENSURE PROPER VALUE VALUE IS ENTERED AND TO RETURN 400 BAD REQUEST IN CASE IT IS NOT.
TEST EMAIL VALIDATION TO ENSURE NEW EMAIL DOES NOT MATCH AN EXISTING EMAIL.
*/


const fs = require("fs");
const express = require('express');

const app = express();
app.use(express.json());

// Function to read data from JSON file
function getdata() {
    const data = fs.readFileSync(__dirname + "/data.json");
    return JSON.parse(data);
}

// Function to write data to JSON file
function savedata(data) {
    fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data, null, 2));
}


function validateId(req, res, next) {
    const id = req.params.id;
    if (isNaN(id) || parseInt(id) < 1) {
        return res.status(400).send('ID inválido, por favor proporcione un valor numérico positivo.');
    }
    next();
}

function isEmailUnique(data, email, idToIgnore = null) {
    const isUniqueInContacts = !data.contacts.some(contact => contact.email === email && contact.id !== idToIgnore);
    const isUniqueInClients = !data.clients.some(client => client.email === email && client.id !== idToIgnore);
    const isUniqueInBusinesses = !data.businesses.some(business => business.email === email && business.id !== idToIgnore);
    
    return isUniqueInContacts && isUniqueInClients && isUniqueInBusinesses;
}



// ---- CONTACTS ROUTES ----

// GET: Retrieve all contacts
app.get('/api/contacts', (req, res) => {
    const data = getdata();
    res.send(data.contacts || []);
});

// GET: Retrieve a specific contact by ID
app.get('/api/contacts/:id', validateId, (req, res) => {
    const data = getdata();
    const contact = data.contacts.find(x => x.id === parseInt(req.params.id));
    if (!contact) {
        return res.status(404).send(`No existe el contacto: ${req.params.id} solicitado`);
    }
    res.send(contact);
});

// POST: Create a new contact
app.post('/api/contacts', (req, res) => {
    const data = getdata();

    const { name, cellphone, email } = req.body;

    if (!name || !cellphone || !email) {
        return res.status(400).send('Por favor, proporcione nombre, teléfono y correo electrónico.');
    }

    if (!isEmailUnique(data, email)) {
        return res.status(400).send('El correo electrónico ya está registrado con otro contacto.');
    }

    const contact = {
        id: data.contacts.length + 1,
        name: req.body.name,
        cellphone: req.body.cellphone,
        email: req.body.email
    };

    data.contacts.push(contact);
    savedata(data);

    res.status(201).send('Contacto creado exitosamente');
});

// PUT: Update a specific contact by ID
app.put('/api/contacts/:id', validateId, (req, res) => {
    const data = getdata();
    const contact = data.contacts.find(x => x.id === parseInt(req.params.id));

    if (!contact) {
        return res.status(404).send(`No existe el contacto con ID: ${req.params.id} solicitado`);
    }

    const { name, cellphone, email } = req.body;
    if (!name || !cellphone || !email) {
        return res.status(400).send('Por favor, proporcione nombre, celular y correo electrónico.');
    }

    if (!isEmailUnique(data, email)) {
            return res.status(400).send('El correo electrónico ya está registrado con otro contacto.');
    }

    contact.name = name;
    contact.cellphone = cellphone;
    contact.email = email;
    savedata(data);

    res.send(contact);
});

// DELETE: Remove a specific contact by ID
app.delete('/api/contacts/:id', validateId, (req, res) => {
    const data = getdata();
    const contactIndex = data.contacts.findIndex(x => x.id === parseInt(req.params.id));
    if (contactIndex === -1) {
        return res.status(404).send(`No existe el contacto con ID: ${req.params.id} solicitado`);
    }

    const removedContact = data.contacts.splice(contactIndex, 1);
    savedata(data);

    res.send(removedContact);
});


// ---- CLIENTS ROUTES ----

// GET: Retrieve all clients
app.get('/api/clients', (req, res) => {
    const data = getdata();
    res.send(data.clients || []);
});

// GET: Retrieve a specific client by ID
app.get('/api/clients/:id', validateId, (req, res) => {
    const data = getdata();
    const client = data.clients.find(x => x.id === parseInt(req.params.id));
    if (!client) {
        return res.status(404).send(`No existe el cliente: ${req.params.id} solicitado`);
    }
    res.send(client);
});

// POST: Create a new client
app.post('/api/clients', (req, res) => {
    const data = getdata();

    const { name, cellphone, email } = req.body;

    if (!name || !cellphone || !email) {
        return res.status(400).send('Por favor, proporcione nombre, celular y correo electrónico.');
    }

    if (!isEmailUnique(data, email)) {
        return res.status(400).send('El correo electrónico ya está registrado con otro cliente.');
    }

    const client = {
        id: data.clients.length + 1,
        name: req.body.name,
        cellphone: req.body.cellphone,
        email: req.body.email
    };

    data.clients.push(client);
    savedata(data);

    res.status(201).send('Cliente creado exitosamente');
});

// PUT: Update a specific client by ID
app.put('/api/clients/:id', validateId, (req, res) => {
    const data = getdata();
    const client = data.clients.find(x => x.id === parseInt(req.params.id));

    if (!client) {
        return res.status(404).send(`No existe el cliente con ID: ${req.params.id} solicitado`);
    }

    const { name, cellphone, email } = req.body;
    if (!name || !cellphone || !email) {
        return res.status(400).send('Por favor, proporcione nombre, celular y correo electrónico.');
    }

    if (!isEmailUnique(data, email, client.id)) {
        return res.status(400).send('El correo electrónico ya está registrado con otro cliente.');
    }

    client.name = name;
    client.cellphone = cellphone;
    client.email = email;
    savedata(data);

    res.send(client);
});

// DELETE: Remove a specific client by ID
app.delete('/api/clients/:id', validateId, (req, res) => {
    const data = getdata();
    const clientIndex = data.clients.findIndex(x => x.id === parseInt(req.params.id));
    if (clientIndex === -1) {
        return res.status(404).send(`No existe el cliente con ID: ${req.params.id} solicitado`);
    }

    const removedClient = data.clients.splice(clientIndex, 1);
    savedata(data);

    res.send(removedClient);
});

// ---- BUSINESSES ROUTES ----

// GET: Retrieve all businesses
app.get('/api/businesses', (req, res) => {
    const data = getdata();
    res.send(data.businesses || []);
});

// GET: Retrieve a specific business by ID
app.get('/api/businesses/:id', validateId, (req, res) => {
    const data = getdata();
    const business = data.businesses.find(x => x.id === parseInt(req.params.id));
    if (!business) {
        return res.status(404).send(`No existe el negocio: ${req.params.id} solicitado`);
    }
    res.send(business);
});

// POST: Create a new business
app.post('/api/businesses', (req, res) => {
    const data = getdata();

    const { name, address, industry } = req.body;

    if (!name || !address || !industry) {
        return res.status(400).send('Por favor, proporcione nombre, dirección e industria.');
    }

    const business = {
        id: data.businesses.length + 1,
        name: req.body.name,
        address: req.body.address,
        industry: req.body.industry
    };

    data.businesses.push(business);
    savedata(data);

    res.status(201).send('Negocio creado exitosamente');
});

// PUT: Update a specific business by ID
app.put('/api/businesses/:id', validateId,(req, res) => {
    const data = getdata();
    const business = data.businesses.find(x => x.id === parseInt(req.params.id));

    if (!business) {
        return res.status(404).send(`No existe el negocio con ID: ${req.params.id} solicitado`);
    }

    const { name, address, industry } = req.body;
    if (!name || !address || !industry) {
        return res.status(400).send('Por favor, proporcione nombre, dirección e industria.');
    }

    business.name = name;
    business.address = address;
    business.industry = industry;
    savedata(data);

    res.send(business);
});

// DELETE: Remove a specific business by ID
app.delete('/api/businesses/:id', validateId,(req, res) => {
    const data = getdata();
    const businessIndex = data.businesses.findIndex(x => x.id === parseInt(req.params.id));
    if (businessIndex === -1) {
        return res.status(404).send(`No existe el negocio con ID: ${req.params.id} solicitado`);
    }

    const removedBusiness = data.businesses.splice(businessIndex, 1);
    savedata(data);

    res.send(removedBusiness);
});

// ---- CATALOGS ROUTES ----

// GET: Retrieve all catalogs
app.get('/api/catalogs', (req, res) => {
    const data = getdata();
    res.send(data.catalogs || []);
});

// GET: Retrieve a specific catalog by ID
app.get('/api/catalogs/:id', validateId, (req, res) => {
    const data = getdata();
    const catalog = data.catalogs.find(x => x.id === parseInt(req.params.id));
    if (!catalog) {
        return res.status(404).send(`No existe el catálogo: ${req.params.id} solicitado`);
    }
    res.send(catalog);
});

// POST: Create a new catalog
app.post('/api/catalogs', (req, res) => {
    const data = getdata();

    const { title, description, items } = req.body;

    if (!title || !description || !items) {
        return res.status(400).send('Por favor, proporcione los campos requeridos')
    }

    const catalog = {
        id: data.catalogs.length + 1,
        title: req.body.title,
        description: req.body.description,
        items: req.body.items
    };

    data.catalogs.push(catalog);
    savedata(data);

    res.status(201).send('Catálogo creado exitosamente');
});

// PUT: Update a specific catalog by ID
app.put('/api/catalogs/:id', validateId, (req, res) => {
    const data = getdata();
    const catalog = data.catalogs.find(x => x.id === parseInt(req.params.id));

    if (!catalog) {
        return res.status(404).send(`No existe el catálogo con ID: ${req.params.id} solicitado`);
    }

    const { title, description, items } = req.body;
    if (!title || !description || !items) {
        return res.status(400).send('Por favor, proporcione nombre y descripción.');
    }

    catalog.title = title;
    catalog.description = description;
    catalog.items = items;
    savedata(data);

    res.send(catalog);
});

// DELETE: Remove a specific catalog by ID
app.delete('/api/catalogs/:id', validateId, (req, res) => {
    const data = getdata();
    const catalogIndex = data.catalogs.findIndex(x => x.id === parseInt(req.params.id));
    if (catalogIndex === -1) {
        return res.status(404).send(`No existe el catálogo con ID: ${req.params.id} solicitado`);
    }

    const removedCatalog = data.catalogs.splice(catalogIndex, 1);
    savedata(data);

    res.send(removedCatalog);
});


// ---- DEFAULT ROUTE ----

app.get('/', (req, res) => {
    res.send('Node.js API for contact, client, business, and catalog management');
});


// Start the server
const port = process.env.port || 5100;
app.listen(port, () => console.log(`Server running on port ${port}...`));