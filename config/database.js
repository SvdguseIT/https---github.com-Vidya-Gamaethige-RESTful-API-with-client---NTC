require('dotenv').config(); 
const { MongoClient } = require('mongodb'); 

const uri = process.env.MONGODB_URI; // Make sure this points to the correct database

// Create a new MongoClient with the URI from .env file
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        // Connect to the MongoDB cluster
        await client.connect(); 
        console.log('Connected to MongoDB');

        // If successful, return the desired database
        const db = client.db('commuter-db');  // Replace with the correct database name
        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);  // Exit the process if connection fails
    }
}

module.exports = { connectDB, client };
