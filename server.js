import express from 'express';

import mongo from './services/db.js';
const PORT = 8888;

const app = express();

// GET route to handle localhost:8888
app.get('/', (req, res) => {
    res.send('Welcome to the Disney API App');
})

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await mongo.connect();
});