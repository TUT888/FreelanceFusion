let express = require('express');
let router = express.Router();

router.get('/login/client', (req, res) => {
    // Mock user data based on role (freelancer, client, etc.)
    req.session.user = {
        id: '66f8c306a1c0c898f44e461d',
        email: 'ngtuanphong98@gmail.com',
        role: 'client',
    };
    res.send(`Logged in as client`);
});

router.get('/login/freelancer', (req, res) => {
    // Mock user data based on role (freelancer, client, etc.)
    req.session.user = {
        id: '66f8c8291a6e2ce0cc40f259',
        email: 'ngtuanphong.111@gmail.com',
        role: 'freelancer',
    };
    res.send(`Logged in as freelancer`);
});




module.exports = router;