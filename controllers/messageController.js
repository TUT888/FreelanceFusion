const ChatModel = require('../models/messageModel');
const client = require('../dbConnection');

// Get Users (Client sees freelancers, Freelancers see clients)
exports.getUsers = async (req, res) => {
    const userType = req.session.user.role;
    const userCollection = client.db().collection('users');

    try {
        // Determine the opposite role for the user
        const role = userType === 'client' ? 'freelancer' : 'client';
        const users = await userCollection.aggregate([
            { $match: { role: role } }, // Match opposite role
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

        res.json(users.map(user => ({ username: user.username, userId: user._id})));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Get chat history between two users (ordered by timestamp)
exports.getChatHistory = async (req, res) => {
    try {
        const messages = await ChatModel.getChatHistory(req.params.userId,req.session.user.id)
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
