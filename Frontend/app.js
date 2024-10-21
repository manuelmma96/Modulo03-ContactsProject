const apiUrl = 'http://localhost:5100/api/users';

// Function to get all users and display them
function getAllUsers() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById('userList');
            userList.innerHTML = ''; // Clear existing list
            data.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `ID: ${user.id}, Username: ${user.username}, Full Name: ${user.fullName}, Email: ${user.email}`;
                userList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

// Function to create a new user
document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, fullName, email })
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        getAllUsers();
    })
    .catch(error => console.error('Error creating user:', error));
});

// Function to update a user
document.getElementById('updateUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('updateUserId').value;
    const username = document.getElementById('updateUsername').value;
    const fullName = document.getElementById('updateFullName').value;
    const email = document.getElementById('updateEmail').value;

    fetch(`${apiUrl}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, fullName, email })
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        getAllUsers();
    })
    .catch(error => console.error('Error updating user:', error));
});

// Function to delete a user
document.getElementById('deleteUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('deleteUserId').value;

    fetch(`${apiUrl}/${userId}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        getAllUsers();
    })
    .catch(error => console.error('Error deleting user:', error));
});