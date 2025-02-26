const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'data', 'users.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/users', (req, res) => {
    const newUser = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const users = JSON.parse(data);
        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing users file:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(201).json({ message: 'User created successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
