const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(payload) {
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}

async function verifyToken(token) {
    try {
        const verify = await jwt.verify(token, process.env.TOKEN_SECRET);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = { generateToken, verifyToken };