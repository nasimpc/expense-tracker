const User = require('../models/user');
const ForgotPasswords = require('../models/forgotpasswords');


const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;
const bcrypt = require('bcrypt');
const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.resetpasswordform = async (request, response, next) => {
    try {
        let id = request.params.id;
        const passwordreset = await ForgotPasswords.findByPk(id);
        if (passwordreset.isactive) {
            passwordreset.isactive = false;
            await passwordreset.save();
            response.sendFile('resetpass.html', { root: 'views' })
        } else {
            return response.status(401).json({ message: "Link has been expired" })
        }

    } catch (error) {

    }
}

exports.requestresetpassword = async (request, response, next) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const sender = {
                email: 'nasimpcm@gmail.com',
                name: 'Nasim'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            const resetresponse = await user.createForgotpassword({});
            const { id } = resetresponse;
            const mailresponse = await tranEmailApi.sendTransacEmail({
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
                    <h1>Reset Your Password</h1>
                    <p>Click the button below to reset your password:</p>
                    <button><a href="http://localhost:3000/password/reset/{{params.role}}">Reset Password</a></button>
                </body>
                </html>`, params: {
                    role: id
                }
            })
            response.status(200).json({ message: 'Password reset email sent' });
        } else {
            response.status(404).json({ message: 'User not found' });
        }


    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interenal Server Error' });
    }
}

exports.resetpassword = async (request, response, next) => {
    try {

        const { resetid, password } = request.body;

        const passwordreset = await ForgotPasswords.findByPk(resetid);

        const currentTime = new Date();
        const createdAtTime = new Date(passwordreset.createdAt);
        const timeDifference = currentTime - createdAtTime;
        const timeLimit = 5 * 60 * 1000;
        if (timeDifference <= timeLimit) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.update(
                {
                    password: hashedPassword
                },
                {
                    where: { id: passwordreset.dataValues.userId }
                }
            );
            response.status(200).json({ message: "Password reset successful." });
        } else {
            response.status(403).json({ message: "Link has expired" });
        }



    } catch (error) {
        console.error("Error resetting password:", error);
        response.status(500).json({ message: "Internal server error" });
    }
};

