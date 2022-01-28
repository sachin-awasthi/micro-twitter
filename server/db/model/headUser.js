const mongoose = require("mongoose");

const headUserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    headUser: {
        type: String
    }
});

const headUser = mongoose.model("headusers", headUserSchema);

module.exports = headUser;