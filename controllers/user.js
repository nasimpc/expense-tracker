const User = require('../models/user');

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