
const Order = require('../models/orders');
const Razorpay = require('razorpay');
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
exports.premiummembership = async (request, response, next) => {
    try {
        console.log(key_id, key_secret);
        const rzpintance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        })
        var options = {
            amount: 1000,
            currency: "INR",
        };
        const orderDetails = await rzpintance.orders.create(options);
        console.log(orderDetails);
        const user = request.user;
        const { id, status } = orderDetails;
        await user.createOrder({
            orderid: id,
            status: status,
        })
        response.status(200).json({ key_id: key_id, orderid: id, user: user });

    } catch (error) {
        console.log('nasim');
        console.log(error);
    }
}
exports.updatetransactionstatus = async (request, response, next) => {
    const { order_id, payment_id, status } = request.body;

    try {
        const user = request.user;
        user.ispremiumuser = true;
        await Promise.all([
            user.save(),
            Order.update(

                { paymentid: payment_id, status: status },
                { where: { orderid: order_id } }
            )
        ])
        response.status(202).json({ success: true, message: "Thank you for being a pro user" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction" });
    }
}
