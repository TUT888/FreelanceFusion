const client = require('../dbConnection');

const mongoURI = process.env.MONGODB_URL_TEST; // Use the test database URI from the environment variable

before(async () => {
    await client.connect();
    console.log('Connected to the test database');
});

after(async () => {
// Drop the test database after tests
    await client.close(); // Close the client connection
});
