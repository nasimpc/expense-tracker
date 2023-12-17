
const User = require('../models/user');

exports.getLeaderboardExpenses = async (request, response, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'totalExpenses'],
      order: [['totalExpenses', 'DESC']],
      limit: 5
    });
    return response.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized - please relogin' });
  }
};




