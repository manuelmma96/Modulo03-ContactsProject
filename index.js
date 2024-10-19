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

// 1. Specific Routes

// PUT: Update a specific contact by ID
app.put('/api/contacts/:id', (req, res) => {
    const contacts = getdata();
    const contact = contacts.find(x => x.id === parseInt(req.params.id));

    if (!contact) {
        return res.status(404).send(`No existe el contacto con ID: ${req.params.id} solicitado`);
    }
    
    // Validate input
    const { name, cellphone, email } = req.body;
    if (!name || !cellphone || !email) {
        return res.status(400).send(`Por favor, proporcione nombre, celular y correo electrónico.`);
    }
    
    // Check if the new email is already used by another contact
    const existingContact = contacts.find(c => c.email === email && c.id !== contact.id);
    if (existingContact) {
        return res.status(400).send('El correo electrónico ya está registrado con otro contacto.');
    }

    // Update contact details
    contact.name = name;
    contact.cellphone = cellphone;
    contact.email = email;
    savedata(contacts);

    res.send(contact);
});

// GET: Retrieve a specific contact by ID
app.get('/api/contacts/:id', (req, res) => {
    const contacts = getdata();
    const contact = contacts.find(x => x.id === parseInt(req.params.id));
    if (!contact) {
        return res.status(404).send(`No existe el contacto: ${req.params.id} solicitado`);
    }
    res.send(contact);
});


// DELETE: Remove a specific contact by ID
app.delete('/api/contacts/:id', (req, res) => {
    const contacts = getdata();
    const contact = contacts.find(x => x.id === parseInt(req.params.id));
    if (!contact) {
        return res.status(404).send(`No existe el contacto con ID: ${req.params.id} solicitado`);
    }

    const index = contacts.indexOf(contact);
    contacts.splice(index, 1);
    savedata(contacts);

    res.send(contact);
});

// 2. Less Specific Routes

// GET: Retrieve all contacts
app.get('/api/contacts', (req, res) => {
    const contacts = getdata();
    res.send(contacts);
});


// POST: Create a new contact
app.post('/api/contacts', (req, res) => {
    const contacts = getdata();

    const contact = {
        id: contacts.length + 1,
        name: req.body.name,
        cellphone: req.body.cellphone,
        email: req.body.email
    };

    contacts.push(contact);
    savedata(contacts);

    res.status(201).send(`Está creado correctamente el nuevo contacto`);
});

// 3. Default or Root Route

// GET: Default route for the homepage or API info
app.get('/', (req, res) => {
    res.send('Node.js API for contact management');
});

// Start the server
const port = process.env.port || 5100;
app.listen(port, () => console.log(`Server running on port ${port}...`));