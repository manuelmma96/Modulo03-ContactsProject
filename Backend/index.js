const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Function to read data from JSON file
function getData() {
    const data = fs.readFileSync(__dirname + "/data.json");
    return JSON.parse(data);
}

// Function to write data to JSON file
function saveData(data) {
    fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data, null, 2));
}

// ---- USERS ROUTES ----

// Root route
app.get('/', (req, res) => {
    res.send('Node.js API for user management');
});

// GET: Retrieve all users
app.get('/api/users', (req, res) => {
    const data = getData();
    res.send(data.users || []);
});

// GET: Retrieve a specific user by ID
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).send('ID must be a number');
    }

    const data = getData();
    const user = data.users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send(`User with ID: ${req.params.id} not found.`);
    }

    res.send(user);
});

// POST: Create a new user
app.post('/api/users', (req, res) => {
    const data = getData();
    const { username, fullName, email } = req.body;

    // Basic validation
    if (!username || !fullName || !email) {
        return res.status(400).send('Please provide a username, full name, and email.');
    }

    // Check if the email is unique
    const isEmailTaken = data.users.some(user => user.email === email);
    if (isEmailTaken) {
        return res.status(400).send('Email is already registered.');
    }

    const newUser = {
        id: data.users.length + 1,
        username,
        fullName,
        email
    };

    data.users.push(newUser);
    saveData(data);

    res.status(201).send('User created successfully');
});

// PUT: Update a specific user by ID
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).send('ID must be a number');
    }

    const data = getData();
    const user = data.users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send(`User with ID: ${req.params.id} not found.`);
    }

    const { username, fullName, email } = req.body;

    // Basic validation
    if (!username || !fullName || !email) {
        return res.status(400).send('Please provide a username, full name, and email.');
    }

    // Check if the email is unique and not the same as the current user's
    const isEmailTaken = data.users.some(u => u.email === email && u.id !== user.id);
    if (isEmailTaken) {
        return res.status(400).send('Email is already registered with another user.');
    }

    user.username = username;
    user.fullName = fullName;
    user.email = email;

    saveData(data);

    res.send('User updated successfully');
});

// DELETE: Remove a specific user by ID
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).send('ID must be a number');
    }

    const data = getData();
    const userIndex = data.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).send(`User with ID: ${req.params.id} not found.`);
    }

    const removedUser = data.users.splice(userIndex, 1);
    saveData(data);

    res.send(`User with ID: ${userId} was successfully deleted.`);
});

// Start the server
const port = process.env.port || 5100;
app.listen(port, () => console.log(`Server running on port ${port}...`));