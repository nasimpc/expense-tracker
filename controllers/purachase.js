const Razorpay = require('razorpay');
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

exports.premiumMembership = async (req, res, nex) => {
    try {
        const rzpintance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        })
        var options = {
            amount: 1000,
            currency: "INR",
        };
        const orderDetails = await rzpintance.orders.create(options);
        const user = req.user;
        const { id, status } = orderDetails;
        user.order.order_id = id;
        user.order.status = status;
        await user.save();
        const userData = {
            name: user.name,
            email: user.email,
        }
        res.status(200).json({ key_id: key_id, orderid: id, user: userData });

    } catch (err) {
        console.log(err);
    }
}
exports.updateTransactionStatus = async (req, res, nex) => {
    const { order_id, payment_id, status } = req.body;

    try {
        // const user = req.user;
        // user.ispremiumuser = true;
        // await Promise.all([
        //     user.save(),
        //     Order.update(

        //         { paymentid: payment_id, status: status },
        //         { where: { orderid: order_id } }
        //     )
        // ])
        const { user } = req;
        const { order } = user;
        user.ispremiumuser = true;
        order.payment_id = payment_id;
        order.status = status;
        order.createdAt = new Date();
        await user.save();
        res.status(200).json({ success: true, message: "Thank you for being a pro user" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "err updating transaction" });
    }
}
