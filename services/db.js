import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb'

export default class MongoDB {
    // get .env creds using constructor
    constructor() {
        dotenv.config();

        // all the .env variables
        const DB_USER = process.env.DB_USER;
        const DB_PASSWORD = process.env.DB_PASSWORD;
        const DB_HOST = process.env.DB_HOST;
        const DB_NAME = process.env.DB_NAME;

        // database uri
        this.mongoURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
        this.client = new MongoClient(this.mongoURL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        
        this.db = null;
    }

    // makes connection with the database
    async connect() {
        try {
           await this.client.connect();
           this.db = this.client.db();
           console.log('Connected');
        }

        catch(error) {
            console.error('Error connecting: ', error);
        }
    }

    // closes connections with the database
    async close() {
        try {
            await this.client.close();
            console.log('Connection closed');
        }

        catch(error) {
            console.error('Error closing connection: ', error)
        }
    }
 
    // creates a collection in the db
    async create(collectionName, data) {
        try {
            const collection = this.db.collection(collectionName);
            const result = await collection.insertOne(data);
            
            return result;
        }
        
        catch(error) {
            console.error('Error inserting data: ', error)
        }
    }

    // finds element in collection by a valid id, otherwise returns the whole collection
    async find(collectionName, id) {
        try {
            const collection = this.db.collection(collectionName);
            
            // if id is valid then return element 
            if (id) 
            {
                const cursor = await collection.find({
                    id : id

                }).toArray();
                return cursor
            }
            
            // if id is not valid, return the collection
            else 
            {
                const cursor = await collection.find({}).toArray();
                return cursor;
            }
        }

        catch(error) {
            console.error('Error finding data:', error)
        }
    }

    // update the time of a element in collection
    async update(collectionName, id, newDate) {
        try {
            const collection = this.db.collection(collectionName);

            // only updates element if the id is valid (not empty id)
            if (id) {
                const filter = {id: id}
                // only changes lastSearched date
                const updateDoc = {
                    $set: {
                        lastSearched: newDate
                    }
                }
                const result = await collection.updateOne(filter, updateDoc)
                
                console.log('Updated \n', result)
            }

        }

        catch(error) {
            console.error('Error updating: ', error)
        }
    }
}
