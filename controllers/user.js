const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res, next) => {
    try {

        console.log(req.body);
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create({ name: name, email: email, password: password });
        res.status(201).json({ newUserDetail: data });
    }
    catch (err) {
        console.log(err);
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

            if (password == user[0].password) {
                res.status(200).json({ success: true, message: "User logged in sucessfully", token: generateAccessToken(user[0].id, user[0].name) })
            }
            else {
                return res.status(400).json({ success: false, message: "User not authorized" })
            }
        }

        else {
            return res.status(404).json({ success: false, message: "User not found" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}