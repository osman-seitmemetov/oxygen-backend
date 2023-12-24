const {Sequelize} = require('sequelize');
const {ssl} = require("pg/lib/defaults");

module.exports = new Sequelize(
    // process.env.DB_NAME,
    // process.env.DB_USER,
    // process.env.DB_PASSWORD,
    process.env.DB_LINK,
    {
        dialect: 'postgres',
        ssl: false,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)