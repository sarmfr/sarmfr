// Initialize an empty array to store users
let users = [];
let editingUserId = null;

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const avatarUrl = document.getElementById('avatarUrl').value;
    const avatarFile = document.getElementById('avatarFile').files[0];
    const role = document.getElementById('role').value;
    const userId = editingUserId || generateUniqueId();

    // Check if the username already exists (only for adding new users, not updating)
    if (!editingUserId && userExists(username)) {
        alert('User already exists! Please use a different username.');
        return; // Stop the form submission if the user already exists
    }

    let avatar;
    if (avatarUrl) {
        avatar = avatarUrl; // Use URL if provided
    } else if (avatarFile) {
        avatar = URL.createObjectURL(avatarFile); // Use uploaded file
    }

    if (editingUserId) {
        const userIndex = users.findIndex(user => user.id === editingUserId);
        users[userIndex] = { id: userId, username, password, avatar, role };
        editingUserId = null;
        document.querySelector('button').textContent = 'Add User';
    } else {
        const newUser = { id: userId, username, password, avatar, role };
        users.push(newUser);
    }

    document.getElementById('userForm').reset();
    resetAvatarPreview(); // Reset avatar preview
    listUsers();
});

// Function to check if a user already exists
function userExists(username) {
    return users.some(user => user.username === username);
}

// Generate a unique ID
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// List users in the table
function listUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td><img src="${user.avatar}" alt="avatar" style="width: 50px; height: 50px; border-radius: 50%;"></td>
            <td>${user.role}</td>
            <td>
                <button class="edit-btn" onclick="editUser('${user.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Edit user
function editUser(id) {
    const user = users.find(user => user.id === id);
    document.getElementById('username').value = user.username;
    document.getElementById('password').value = user.password;
    document.getElementById('avatarUrl').value = '';
    document.getElementById('avatarFile').value = '';
    setAvatarPreview(user.avatar); // Preview the current avatar
    document.getElementById('role').value = user.role;
    editingUserId = id;

    document.querySelector('button').textContent = 'Update User';
}

// Delete user
function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    listUsers();
}

// Set avatar preview from URL or file input
document.getElementById('avatarUrl').addEventListener('input', function() {
    const avatarUrl = document.getElementById('avatarUrl').value;
    if (avatarUrl) {
        setAvatarPreview(avatarUrl);
    } else {
        resetAvatarPreview();
    }
});

document.getElementById('avatarFile').addEventListener('change', function() {
    const avatarFile = document.getElementById('avatarFile').files[0];
    if (avatarFile) {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            setAvatarPreview(e.target.result);
        };
        fileReader.readAsDataURL(avatarFile);
    } else {
        resetAvatarPreview();
    }
});

// Set the avatar preview image
function setAvatarPreview(src) {
    const avatarPreview = document.getElementById('avatarPreview');
    avatarPreview.src = src;
    avatarPreview.style.display = 'block';
}

// Reset the avatar preview
function resetAvatarPreview() {
    const avatarPreview = document.getElementById('avatarPreview');
    avatarPreview.src = '#';
    avatarPreview.style.display = 'none';
}
