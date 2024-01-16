const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = process.env.JWT_SECRET_KEY;

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const tokenDecode = jwt.verify(token, secretKey);
        const user = await User.findByPk(tokenDecode.userId);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false })
    }
}

//module.exports = authenticate; doubt why it is not working
module.exports = {
    authenticate
} 
