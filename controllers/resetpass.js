const User = require('../models/user');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
// exports.requestresetpassword = async (request, response, next) => {
//     try {
//         console.log('hi');
//         const { email } = request.body;
//         const user = await User.findOne({
//             where: {
//                 email: email
//             }
//         });
//         console.log(email);
//         if (user) {
//             const sender = {
//                 email: 'nasimpcmuhammed@gmail.com',

//             }
//             const receivers = [
//                 {
//                     email: email
//                 }
//             ]

//             const mailresponse = await tranEmailApi.sendTransacEmail({
//                 sender,
//                 to: receivers,
//                 subject: "Reset Your password",
//                 textContent: `hi my name is nasim`
//             })

//             response.status(200).json({ message: 'Password reset email sent' });
//         } else {
//             response.status(404).json({ message: 'User not found' });
//         }


//     } catch (error) {
//         console.log(error);
//         response.status(500).json({ message: 'Interenal Server Error' });
//     }
// }
exports.requestresetpassword = async (request, response, next) => {

    console.log('hi');
    const { email } = request.body;
    const user = await User.findOne({
        where: {
            email: email
        }
    });
    console.log(email);

    const sender = {
        email: 'nasimpcm@gmail.com',

    }
    const receivers = [
        {
            email: email
        }
    ]
    try {
        const mailresponse = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Reset Your password",
            textContent: `hi my name is nasim`
        })

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interenal Server Error' });
    }
    response.status(200).json({ message: 'Password reset email sent' });


}
