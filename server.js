const express= require("express");
const session = require('express-session');
const app = express();
const path = require('path');
const MongoStore = require('connect-mongo');


const port = process.env.PORT || 3000;
require('dotenv').config();
require('./dbConnection');






app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
    autoRemove: 'native'
});



app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
     }
}));

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

// Routing
let homeRouter = require('./routers/homeRouter');
let profileRouter = require('./routers/profileRouter');
let jobRouter = require('./routers/jobRouter');

let freelancerRouter = require('./routers/freelancerRouter');


app.use('/', homeRouter);
app.use('/profile', profileRouter);
app.use('/jobs', jobRouter);
app.use('/freelancers', freelancerRouter);



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