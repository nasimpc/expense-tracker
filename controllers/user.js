const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getLoginPage = (request, response, next) => {
    response.sendFile('login.html', { root: 'views' });
}
exports.getSignupPage = (request, response, next) => {
    response.sendFile('signup.html', { root: 'views' });
}
exports.getMainPage = (request, response, next) => {
    response.sendFile('main.html', { root: 'views' });
}

exports.addUser = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        if (isstringnotvalid(name) || isstringnotvalid(email) || isstringnotvalid(password)) {
            return res.status(400).json({ err: "Something is missing" })
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            const user = await User.create({ name, email, password: hash })
            res.status(201).json({ message: 'Successfuly create new user', token: generateAccessToken(user.dataValues.id, user.dataValues.name) })
        })

    }
    catch (err) {
        res.status(500).json({
            error: err
        })
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
    return jwt.sign({ userId: id, name: name }, 'secretkey')
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isstringnotvalid(email) || isstringnotvalid(password)) {
            return res.status(400).json({ message: "Email id or password is missing", success: false })
        }
        const user = await User.findAll({ where: { email } })
        if (user.length > 0) {

            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: "Something went wrong" })
                }
                if (result == true) {
                    res.status(200).json({ success: true, message: "User logged in sucessfully", token: generateAccessToken(user[0].id, user[0].name) })
                }
                else {
                    return res.status(400).json({ success: false, message: "Password is incorrect" })
                }
            })
        }

        else {
            return res.status(404).json({ success: false, message: "User not found" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

exports.getcurrentuser = async (request, response, next) => {
    const user = request.user;
    response.json({ user });
}
