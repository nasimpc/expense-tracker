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
        user.order.push({
            order_id: id,
            status: status,
            createdAt: new Date()
        })
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
        console.log(req.user.order, order_id);
        const { user } = req;
        const { order } = user;
        let currOrder;
        for (let i = 0; i < order.length; i++) {
            if (order[i].order_id == order_id) {
                currOrder = order[i];
                break;
            }
        }
        user.ispremiumuser = true;
        currOrder.payment_id = payment_id;
        currOrder.status = status;
        currOrder.createdAt = new Date();
        await user.save();
        res.status(200).json({ success: true, message: "Thank you for being a pro user" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "An error occured" });
    }
}
