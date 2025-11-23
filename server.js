import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'data', 'users.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preloader', 'preloader.html'));
});

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
