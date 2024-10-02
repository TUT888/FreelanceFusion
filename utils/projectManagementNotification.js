let onlineUsers = {}; 

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // When the user logs in or connects, register their socket ID with their user ID
        socket.on('register', (userId) => {
            onlineUsers[userId] = socket.id;
            console.log(`User ${userId} connected with socket ID ${socket.id}`);
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            // Remove the user from onlineUsers when they disconnect
            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    delete onlineUsers[userId];
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
};

// Utility function to emit notifications to a specific user
module.exports.sendNotificationToUser = (io, userId, message) => {
    const socketId = onlineUsers[userId];
    if (socketId) {
        io.to(socketId).emit('task-notification', { message: message });
        console.log(`Notification sent to user ${userId}`);
    } else {
        console.log(`User ${userId} is not online`);
    }
};