const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    username: {
        type: String
    },
    usernameLowerCase: {
        type: String
    },
    collectionName: {
        type: String
    },
    collectionNameLowerCase: {
        type: String
    },
    collectionUserIds: {
        type: [String]
    }
});

const Collection = mongoose.model("collections", collectionSchema);

module.exports = Collection;