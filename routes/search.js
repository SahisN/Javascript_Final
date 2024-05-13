import express from 'express';
import { searchByKeyword } from '../services/api.js';
import { db } from '../server.js';

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const { query } = req;
        const results = await searchByKeyword(query.searchTerm);
        const filter = { searchTerm: query.searchTerm };

        const document = {
            searchTerm: query.searchTerm,
            searchCount: results.length,
            lastSearched: new Date()
        };

        const cursor = await db.find('search_history', filter);
        const arr = await cursor.toArray();

        if (arr.length) {
            await db.update('search_history', filter, {
                lastSearched: new Date()
            });
        } else {
            await db.create('search_history', document);
        }
        res.json(document);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;




// code