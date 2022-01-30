const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    usernameLowerCase: {
        type: String
    },
    password: {
        type: String
    },
    createdOn: {
        type: Date
    }
});

const User = mongoose.model("users", userSchema);

module.exports = User;