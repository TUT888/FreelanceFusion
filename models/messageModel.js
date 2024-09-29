const client = require('../dbConnection');
 

const ChatModel = {
    async getChatHistory(userId1, userId2) {
        const chatCollection = client.db().collection('messages');
        return await chatCollection.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        }).toArray();
    },


};

module.exports = ChatModel;
