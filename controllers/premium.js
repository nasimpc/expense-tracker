const User = require('../models/user');
const Expenses = require('../models/expense');
const AwsService = require('../services/aws-services');

exports.getLeaderboardExpenses = async (req, res, nex) => {
  try {
    const leaderboard = await User.find({})
      .select('name totalExpenses')
      .sort({ totalexpenses: -1 })
      .limit(15);
    return res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'An error occurred' });
  }
};

exports.getDownloadhistory = async (req, res, nex) => {
  try {
    const { user: { downloadUrl } } = req;
    res.status(200).json({ history: downloadUrl });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Unable to fetch history' });
  }
}

exports.getDownloadURL = async (req, res, nex) => {
  try {
    const user = req.user;
    const expenses = await Expenses.find({ "userId": user._id })
    const formattedExpenses = expenses.map(expense => {
      return `Category: ${expense.category}
      Payment Method: ${expense.pmethod}
      Amount: ${expense.amount}
      Date: ${expense.date}
      `;
    });
    const textData = formattedExpenses.join("\n");
    const filename = `expense/user${user.id}/${user.name}${new Date()}.txt`;
    const URL = await AwsService.uploadToS3(textData, filename);
    user.downloadUrl.push({
      url: URL,
      createdAt: new Date()
    })
    await user.save();
    res.status(200).json({ URL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unable to generate URL" });
  }
};





