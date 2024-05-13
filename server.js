import express from 'express';

import MongoDB from './services/db.js';

import search from './routes/search.js'

const PORT = 8888;
const mongo = new MongoDB();


const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the Disney API App');
});

app.use('/search', search);

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await mongo.connect();
});