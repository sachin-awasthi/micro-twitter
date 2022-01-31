const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { generateToken } = require("./jwtToken");
const authorize = require('./authorize');
const { getUserIdByUsername, getFollowingByUserId, getTweetsByUserId } = require('./handleTweets');
const User = require("./db/model/User");
const headUser = require("./db/model/headUser");
const Collection = require("./db/model/Collection");
const shuffle = require("./shuffle");

require("./db/mongoose");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;
const node_env = process.env.NODE_ENV;

app.use(cors({
    credentials: true,
    origin: "https://micro-twitter.netlify.app",
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
        const checkUser = await User.findOne({ usernameLowerCase: username.toLowerCase() }).exec();
        if (checkUser) {
            return res.status(203).send("Username already exists!");
        }
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username: username, usernameLowerCase: username.toLowerCase(), password: hash, createdOn: Date.now() });
        await user.save();

        //default headUser = "@sachin_rt"
        const headuser = new headUser({ username: username, usernameLowerCase: username.toLowerCase(), headUser: "sachin_rt" });
        await headuser.save();

        res.status(200).send("Signup Successful");

    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const hash = await bcrypt.hash(password, 10);
        const user1 = await User.findOne({ usernameLowerCase: username.toLowerCase() }).exec();

        let dbpassword = user1 ? user1.password : "";

        const checkPswd = await bcrypt.compare(password, dbpassword);

        if (checkPswd) {
            const payload = {
                username: username,
                createdAt: Date.now()
            }
            const token = generateToken(payload);

            currentUser = username;
            //maxAge is in milliseconds
            //httpOnly prevents cookie to be accessible from document.cookie, it is only sent in request headers
            res.cookie("jwt-token", token, {
                //  maxAge: 3000 * 1000, 
                httpOnly: true
            });
            res.cookie("currentUser", username, {
                httpOnly: true
            })
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

app.get("/getTweets/:headUser", authorize, async (req, res) => {
    try {

        const headUser = req.params.headUser;

        let userData = await getUserIdByUsername(headUser);

        if (userData.length === 0 || !userData[0]) {
            return res.status(200).send("Invalid Twitter Username");
        }

        let aData = {};
        let userId = userData[0]["id"];

        aData["userId"] = userId;
        aData["name"] = userData[0]["name"];
        aData["username"] = userData[0]["username"];

        let followingData = await getFollowingByUserId(userId);

        if (followingData.length === 0 || !followingData[0]) {
            return res.status(200).send("No tweets available");
        }

        followingData = shuffle(followingData[0]);

        let allTweets = [], following = [];
        let totalTweetCount = 0;
        for (let fUser = 0; fUser < followingData.length; fUser++) {
            //for Testing - limit to 10 Tweets for lesser Twitter API calls
            if (totalTweetCount >= 10) continue;
            let fUserId = followingData[fUser]["id"];
            let fFollowingName = followingData[fUser]["name"];
            let fFollowingUserName = followingData[fUser]["username"];

            following.push({
                "followingUserId": fUserId,
                "followingName": fFollowingName,
                "followingUsername": fFollowingUserName
            });
            let fTweets = await getTweetsByUserId(fUserId);

            if (!fTweets[0] || fTweets.length === 0) {
                continue;
            }
            if (fTweets[0].length > 5) {
                fTweets[0] = fTweets[0].slice(0, 5);
            }
            totalTweetCount += fTweets[0].length;
            allTweets.push({
                "fUserId": fUserId,
                "fName": fFollowingName,
                "fUsername": fFollowingUserName,
                "fTweets": fTweets[0]
            });
        }

        aData["userFollowing"] = following;
        aData["allTweets"] = allTweets;
        res.status(200).send(aData);
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
});

app.get("/getHeadUser", authorize, async (req, res) => {
    try {
        const currentUser = req.cookies["currentUser"];
        const user = await headUser.findOne({ usernameLowerCase: currentUser.toLowerCase() }).exec();
        res.status(200).send({ "headUser": user.headUser });
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
});

app.post("/updateHeadUser", authorize, async (req, res) => {
    try {
        const { headuser } = req.body;
        const currentUser = req.cookies["currentUser"];

        const user = await headUser.findOne({ usernameLowerCase: currentUser.toLowerCase() }).exec();

        user["headUser"] = headuser;
        await user.save();

        res.status(200).send("HeadUser updated");

    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.post("/createCollection", authorize, async (req, res) => {
    try {
        const currentUser = req.cookies["currentUser"];
        const collectionName = req.body["collection"];
        const selectedUsers = req.body["usersSelected"];

        // check if a collection name exists
        const checkCollection = await Collection.findOne({ usernameLowerCase: currentUser.toLowerCase(), collectionNameLowerCase: collectionName.toLowerCase() }).exec();
        if (checkCollection) {
            return res.status(203).send("Collection already exists!");
        }

        const newCollection = new Collection({ username: currentUser, usernameLowerCase: currentUser.toLowerCase(), collectionName: collectionName, collectionNameLowerCase: collectionName.toLowerCase(), collectionUserIds: selectedUsers });
        await newCollection.save();

        res.status(200).send("Collection created");

    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.get("/getMyCollections", authorize, async (req, res) => {
    try {
        const currentUser = req.cookies["currentUser"];

        // check if a collection name exists
        const collections = await Collection.find({ usernameLowerCase: currentUser.toLowerCase() }).exec();
        const collectionTweets = [];

        for (let i = 0; i < collections.length; i++) {
            let obj = {
                collectionName: collections[i]["collectionName"]
            }
            let collectionUserIds = collections[i]["collectionUserIds"];

            for (let j = 0; j < collectionsUserIds.length; j++) {
                let tweets = getTweetsByUserId(collectionUserIds[j]);
                if (!tweets[0] || tweets.length === 0) continue;


                obj["collectionTweets"].push(tweets[0]);

                //for Testing - limit to 3 for lesser Twitter API calls
                if (j >= 3) break;
            }
        }

        res.status(200).send({
            myCollections: collections
        });

    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.listen(port, () => {
    console.log(`Server started at ${port}!`);
});