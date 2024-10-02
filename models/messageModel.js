const client = require('../dbConnection');
const { ObjectId } = require('mongodb'); 

const ChatModel = {
    async getChatHistory(userId1, userId2) {
        try {

            // Validate ObjectId format
            if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) {
                console.error('Invalid ObjectId format for userId1 or userId2');
                return []; // Return empty array if invalid
            }

            // Convert the user IDs to ObjectId
            const objectUserId1 = new ObjectId(userId1);
            const objectUserId2 = new ObjectId(userId2);

            // Access the collection and perform the query
            const chatCollection = client.db().collection('messages');
            return await chatCollection.find({
                $or: [
                    { sender_id: objectUserId1, receiver_id: objectUserId2 },
                    { sender_id: objectUserId2, receiver_id: objectUserId1 }
                ]
            }).sort({ timestamp: 1  }).toArray(); // Sort by timestamp

        } catch (error) {
            // Catch and log any errors that occur during the query
            console.error('Error fetching chat history:', error);
            return [];
        }
    },
};

module.exports = ChatModel;
