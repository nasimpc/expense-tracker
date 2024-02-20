const User = require('../models/user');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;
const bcrypt = require('bcrypt');
const tranEmailApi = new Sib.TransactionalEmailsApi();
const { ObjectId } = require('mongodb');

exports.requestResetPassword = async (req, res, nex) => {
    try {

        const { email } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            const sender = {
                email: 'nasimpcm@gmail.com',
                name: 'Nasim'
            }
            const receivers = [{ email: email }]
            user.forgotPassword.push({
                isActive: true,
                createdAt: new Date()
            })
            const { forgotPassword } = await user.save();
            const id = forgotPassword[forgotPassword.length - 1]._id.toString();
            await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Your password",
                htmlContent: `
              <!DOCTYPE html>
                <html>
                <head>
                    <title>Password Reset</title>
                </head>
                <body>
                    <h1>Reset Simple Expense Tracker password</h1>
                    <p>Click the button below to reset your password:</p>
                    <button><a href="${process.env.WEBSITE}/password/reset/{{params.role}}">Reset Password</a></button>
                    </body>
                    </html>`, params: {
                    role: id
                }
            })
            res.status(200).json({ message: 'Password reset email sent' });
        } else {
            res.status(400).json({ message: 'User not found' });
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Interenal Server err' });
    }
}

exports.resetPasswordForm = async (req, res, nex) => {
    try {
        let id = req.params.id;
        const user = await User.findOne({
            "forgotPassword": {
                $elemMatch: { "_id": new ObjectId(id) }
            }
        });
        const { forgotPassword } = user;
        const passwordreset = forgotPassword.find(item => item._id.equals(new ObjectId(id)));
        console.log(passwordreset);
        if (passwordreset.isActive) {
            passwordreset.isActive = false;
            await user.save();
            res.sendFile('resetpass.html', { root: 'views' })
        } else {
            return res.status(400).json({ message: "Link has been expired" })
        }

    } catch (err) {
        console.log(err)

    }
}

exports.resetPassword = async (req, res, nex) => {
    try {

        const { resetid, password } = req.body;
        const user = await User.findOne({
            "forgotPassword": {
                $elemMatch: {
                    "_id": new ObjectId(resetid)
                }
            }
        });
        const { forgotPassword } = user;
        const passwordreset = forgotPassword.find(item => item._id.equals(new ObjectId(resetid)))
        const currentTime = new Date();
        const createdAtTime = new Date(passwordreset.createdAt);
        const timeDifference = currentTime - createdAtTime;
        const timeLimit = 10 * 60 * 1000;
        if (timeDifference <= timeLimit) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();
            // await User.update(
            //     {
            //         password: hashedPassword
            //     },
            //     {
            //         where: { id: passwordreset.dataValues.userId }
            //     }
            // );
            res.status(200).json({ message: "Password reset successful." });
        } else {
            res.status(400).json({ message: "Link has expired" });
        }

    } catch (err) {
        console.err("err resetting password:", err);
        res.status(500).json({ message: "Internal server err" });
    }
};

