const mongoose = require("mongoose");
require('dotenv').config();
const mongo_password = process.env.MONGO_PASSWORD;

mongoose.connect(
    `mongodb+srv://sachin32:${mongo_password}@cluster0.ilkbr.mongodb.net/micro-twitter`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
// .then(() => console.log("Connected"))
//     .catch((e) => console.log(e));