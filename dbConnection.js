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

client.connect();

module.exports = client;