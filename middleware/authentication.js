const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = process.env.JWT_SECRET_KEY;

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const jwt_user = jwt.verify(token, secretKey);
        const user = await User.findById(jwt_user.userId)
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false })
    }
}

module.exports = {
    authenticate
} 
