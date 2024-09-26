const mongoose = require('mongoose');
const client = require('../dbConnection');

const mongoURI = 'your_mongo_db_uri'; 

before(async () => {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

after(async () => {
    await mongoose.connection.dropDatabase(); 
    await mongoose.connection.close(); 
});
