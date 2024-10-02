const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
require("dotenv").config();
require("./dbConnection");
const MongoStore = require("connect-mongo");
const Message = require("./models/messageModel");
let client = require("./dbConnection");
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URL,
  collectionName: "sessions",
  ttl: 24 * 60 * 60,
  autoRemove: "native",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

// Routing
let homeRouter = require("./routers/homeRouter");
let profileRouter = require("./routers/profileRouter");
let jobRouter = require("./routers/jobRouter");

let freelancerRouter = require("./routers/freelancerRouter");
let messageRouter = require("./routers/messageRouter");
const { ObjectId } = require('mongodb'); 

app.use("/", homeRouter);
app.use("/profile", profileRouter);
app.use("/jobs", jobRouter);
app.use("/freelancers", freelancerRouter);
app.use("/messages", messageRouter);

// Socket
let http = require("http").createServer(app);
let io = require("socket.io")(http);

// Handle sending messages
io.on('connection', (socket) => {
    console.log("User connected!");

    socket.on('sendMessage', async (data) => {
        const { sender_id, receiver_id, content } = data;
        const message = {
            sender_id : new ObjectId(sender_id),
            receiver_id :new ObjectId(receiver_id),
            content,
            timestamp: new Date()
        };

        // Insert message into DB
        await client.db().collection('messages').insertOne(message);

        // Emit to both sender and receiver
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log("User disconnected");
    });
});



http.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;