

const ChatModel = require('../models/messageModel');
const client = require('../dbConnection');
 

exports.getUsers = async (req, res) => {
    const userType = req.session.user.role;
    const userCollection = client.db().collection('users');
    const authCollection = client.db().collection('auths'); // Adjust to your actual collection name
    console.log('Current session:', req.session);
    console.log(`Fetching users for user type: ${userType}`);


    try {
        // Fetch the role based on the user type
        const role = userType === 'client' ? 'freelancer' : 'client';

        console.log(`Looking for users with role: ${role}`);

        // Use aggregation to join the two collections
        const users = await userCollection.aggregate([
            { $match: { role: role } },
            {
                $lookup: {
                    from: 'auths', 
                    localField: '_id', 
                    foreignField: '_id',
                    as: 'authDetails'
                }
            },
            { $unwind: '$authDetails' },
            { $project: { username: '$authDetails.username' } } 
        ]).toArray();

        console.log('Users fetched from database:', users);

        res.json(users.map(user => ({ username: user.username })));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.getChatHistory = async (req, res) => {
    const username = req.params.username;

    try {
        const messages = await client.db().collection('messages').find({
            $or: [
                { sender: req.session.username, receiver: username },
                { sender: username, receiver: req.session.username }
            ]
        }).toArray();

        res.json(messages);
    } catch (error) {
        res.status(500).send('Error fetching chat history');
    }
};



exports.getMessages = async (req, res) => {
    try {
        const messages = await client.db().collection('messages').find({}).toArray();
        
        if (!messages || messages.length === 0) {
            return []; 
        }

        return messages; 
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error; 
    }
};



