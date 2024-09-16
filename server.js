const express= require("express");
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
require('dotenv').config();
require('./dbConnection');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routing
let homeRouter = require('./routers/homeRouter');
let profileRouter = require('./routers/profileRouter');
let jobRouter = require('./routers/jobRouter');

app.use('/', homeRouter);
app.use('/profile', profileRouter);
app.use('/jobs', jobRouter);

// Socket
let http = require('http').createServer(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log("A user connected!");
    socket.on('disconnect', () => {
        console.log("A user disconnected!");
    });
});

http.listen(port, () => {
    console.log("Server started: http://localhost:" + port);
})