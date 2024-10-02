let userModel = require('../models/user');

let userEmailMapping = {};
module.exports = function(io) {
    io.on('connection', (socket) => {
        // Send announcement if a user connected
        let welcomeMessage = "You have registered to announcement event!";
        socket.emit('announcement', welcomeMessage);
        socket.on('announcement', (msg) => {
            console.log('Announcement from rating.js: ' + msg);
        });

        // Rating notification
        socket.on('registerRatingNotification', async (userEmail) => {
            userEmailMapping[userEmail] = socket.id;
            console.log(`User ${userEmail} has registered for rating notfification. Connected users: ${Object.keys(userEmailMapping).length}`);

            socket.on('ratingNotification', async (emitData) =>{
                let targetUserID = emitData.targetUserID;
                let targetUserEmail = (await userModel.getEmailByUserID(targetUserID)).email;
                let targetSocketID = userEmailMapping[targetUserEmail];
                console.log(`Prepare sending message to... ${targetUserID} - ${targetUserEmail} - ${targetSocketID}`);
                // io.to(targetSocketID).emit(
                //     'announcement',
                //     "Hi, you have got new notification"
                // )
                io.to(targetSocketID).emit('ratingNotification', {
                    message: "You got a new rating from client!"
                })
            })
        });
    });
}