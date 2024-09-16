// MongoDB connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = process.env.MONGODB_URL

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

module.exports = client;