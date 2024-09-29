const express = require('express');
const router = express.Router();
const chatController = require('../controllers/messageController');
const isAuthenticated = require('../middleware/auth');



router.get('/', isAuthenticated, async (req, res) => {
    try {
        const messages = await chatController.getMessages(req, res);
        const userType = req.session.userType;

     
        res.render('messages', {
            messages: messages, 
            session: req.session, 
            userType: userType 
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error fetching messages' });
    }
});



router.get('/messages', isAuthenticated, chatController.getMessages);
router.get('/users', isAuthenticated, chatController.getUsers);
router.get('/history/:username', isAuthenticated, chatController.getChatHistory);

module.exports = router;
