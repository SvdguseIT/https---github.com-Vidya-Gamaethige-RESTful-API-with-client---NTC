require('dotenv').config(); 
const { MongoClient } = require('mongodb'); 
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect(); 
        console.log('Connected to MongoDB');
        const db = client.db('BusRoute'); 
        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); 
    }
}

module.exports = { connectDB, client };