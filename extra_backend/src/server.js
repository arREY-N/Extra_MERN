import 'dotenv/config'

import express from 'express'

const app = express();

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    return res.send('Welcome to ExTra from the backend');
});

app.get('/users', (req, res) => {
    return res.send('This is the USERS PAGE');
})

app.get('/register', (req, res) => {
    return res.send('This is the REGISTRATION PAGE');
})

app.listen(PORT, () => {
    console.log(`Access backend at http://localhost:${PORT}`);
})