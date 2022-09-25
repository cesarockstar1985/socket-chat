const { Sequelize } = require('sequelize')

const db = new Sequelize('socketChat', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = { db }