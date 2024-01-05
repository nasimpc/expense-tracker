
const User = require('../models/user');
const AwsService = require('../services/awsservices');

exports.getLeaderboardExpenses = async (req, res, nex) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'totalExpenses'],
      order: [['totalExpenses', 'DESC']],
      limit: 5
    });
    return res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Unauthorized - please relogin' });
  }
};

exports.getDownloadhistory = async (req, res, nex) => {
  try {
    const user = req.user;
    const history = await user.getDownloads();
    res.status(200).json(history);

  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Unable to fetch history' });
  }
}

exports.getDownloadURL = async (req, res, nex) => {
  try {
    const user = req.user;
    const expenses = await user.getExpenses({
      attributes: ["amount", "description", "category"],
    });
    const formattedExpenses = expenses.map(expense => {
      return `Amount: ${expense.amount}
    Description: ${expense.description}
    Category: ${expense.category}
    `;
    });
    const textData = formattedExpenses.join("\n");


    const filename = `expense/user${user.id}/${user.name}${new Date()}.txt`;
    const URL = await AwsService.uploadToS3(textData, filename);
    await user.createDownload({
      downloadUrl: URL
    })
    res.status(200).json({ URL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unable to generate URL" });
  }
};





