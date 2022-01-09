const { verifyToken } = require("./jwtToken");

async function authorize(req, res, next) {
    if (!req.cookies) {
        return res.status(203).send("Access denied");
    }
    const token = req.cookies["jwt-token"];
    const verified = await verifyToken(token);
    return verified ? next() : res.status(203).send("Access denied");
}

module.exports = authorize;