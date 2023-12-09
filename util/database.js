const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense', 'root', 'internship', {
    dialect: 'mysql',
    host: 'localhost'

})
module.exports = sequelize;