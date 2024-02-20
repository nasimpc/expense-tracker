const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

exports.getIntroPage = (req, res, nex) => {
    res.sendFile('intro.html', { root: 'views' });
}
exports.getProPage = (req, res, nex) => {
    res.sendFile('pro.html', { root: 'views' });
}
exports.getMainPage = (req, res, nex) => {
    res.sendFile('main.html', { root: 'views' });
}

exports.addUser = async (req, res, nex) => {
    try {
        const { name, email, password } = req.body;
        if (isstringnotvalid(name) || isstringnotvalid(email) || isstringnotvalid(password)) {
            return res.status(400).json({ err: "Something is missing" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        const { _id } = await user.save();
        const id = _id.toString();
        const token = generateAccessToken(id, name)
        res.status(200).json({ message: 'Successfuly create new user', token: token })

    }
    catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
}
function isstringnotvalid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}
function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, secretKey)
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isstringnotvalid(email) || isstringnotvalid(password)) {
            return res.status(400).json({ message: "Email id or password is missing", success: false })
        }
        let user = await User.findOne({ email: email });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const id = user._id.toString();
                res.status(200).json({ success: true, message: "User logged in sucessfully", token: generateAccessToken(id, user.name) });
            } else {
                response.status(401).send('Authentication failed');
            }
        }
        else {
            return res.status(400).json({ success: false, message: "User not found" })
        }
    }
    catch (err) {
        res.status(500).json({ message: "An error occured", success: false })
    }
}

exports.getCurrentUser = async (req, res, nex) => {
    const user = req.user;
    res.json({ user });
}
