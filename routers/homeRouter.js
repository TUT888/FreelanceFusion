let express = require('express');
let router = express.Router();
let controller = require('../controllers/homeController');

router.get('/', (req, res) => {
    res.render('index.ejs');
});

module.exports = router;