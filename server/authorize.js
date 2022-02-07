const { verifyToken } = require("./jwtToken");

async function authorize(req, res, next) {
    const token = req.headers["jwt-token"];

    // const token = req.cookies["jwt-token"];

    const verified = await verifyToken(token);
    return verified ? next() : res.status(203).send("Access denied");
}

module.exports = authorize;