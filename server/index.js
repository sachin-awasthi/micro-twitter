const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { generateToken } = require("./jwtToken");
const authorize = require('./authorize');
const { fetchTweetsById } = require('./handleTweets');
const User = require("./db/model/User");

require("./db/mongoose");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "./client/build")));

const port = process.env.PORT;
const node_env = process.env.NODE_ENV;

app.use(cors({
    credentials: true,
    origin: node_env === 'DEV' ? "http://localhost:3000" : "https://micro-twitter-india.herokuapp.com",
    exposedHeaders: ["set-cookie"]
}));

app.get("/", authorize, async (req, res) => {
    try {
        res.status(200).send("User authorized");
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const checkUser = await User.findOne({ username: username }).exec();
        if (checkUser) {
            throw Error("Username already exists!");
        }
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username: username, password: hash, createdOn: Date.now() });
        await user.save();

        res.status(200).send("Signup Successful");

    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const hash = await bcrypt.hash(password, 10);
        const user1 = await User.findOne({ username: username }).exec();

        let dbpassword = user1 ? user1.password : "";

        const checkPswd = await bcrypt.compare(password, dbpassword);

        if (checkPswd) {
            const payload = {
                username: username,
                createdAt: Date.now()
            }
            const token = generateToken(payload);

            //maxAge is in milliseconds
            //httpOnly prevents cookie to be accessible from document.cookie, it is only sent in request headers
            res.cookie("jwt-token", token, {
                //  maxAge: 3000 * 1000, 
                httpOnly: true
            });
            res.status(200).send({ msg: "Logged in", user: username, token: token });
        }
        else {
            res.status(203).send({ msg: "Invalid credentials" });
        }
    } catch (e) {
        res.status(400).send(e.toString());
    }

});

app.get("/logout", authorize, async (req, res) => {
    try {
        const token = req.cookies["jwt-token"];

        res.cookie("jwt-token", token, {
            maxAge: 0,
            httpOnly: true
        });
        res.status(200).send({ msg: "Logged out", token: token });
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.get("/getTweets", authorize, async (req, res) => {
    try {
        // let data = await fetchTweetsById("18929773");
        res.status(200).send([{ id: 1, text: "Hello" }, { id: 2, text: "Bye" }]);
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
});

app.listen(port, () => {
    console.log(`Server started at ${port}!`);
});