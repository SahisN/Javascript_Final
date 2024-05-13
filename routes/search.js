import express from 'express';
import * as api from '../services/api.js'; 
import MongoDB from '../services/db.js';

const router = express.Router();
const mongo = new MongoDB();
await mongo.connect();

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

        const cursor = await mongo.find('search_history', filter);
        const arr = await cursor.toArray();

        if (arr.length) {
            await mongo.update('search_history', filter, {
                lastSearched: new Date()
            });
        } else {
            await mongo.create('search_history', document);
        }
        res.json(document);
    } catch (error) {
        res.status(500).json(error);
    }
});


router.get('/:id/details/', async (req,res) => {
    try{
        const { params, query } = req; 
        const characterId  = params.id;
        const { cache }  = query;

        let searchChar;
        let result;

        if(cache === 'true') {
            const cacheResult = await mongo.find('search_cache', characterId);
            console.log(cacheResult);

            if(!cacheResult.length){
                searchChar = await api.details(characterId);
                result = {id: characterId, name: searchChar.data.name, films: searchChar.data.films, videogames: searchChar.data.videoGames}
                await mongo.create('search_cache', result);         
            } else {
                result = cacheResult;
            }

        } else {
            searchChar = await api.details(characterId);
            result = {id: characterId, name: searchChar.data.name, films: searchChar.data.films, videogames: searchChar.data.videoGames}
            await mongo.create('search_cache', result);
        }

        
        res.json(result);
    } catch (err) {
        res.status(500).json({ err });
    }
});

export default router; 










