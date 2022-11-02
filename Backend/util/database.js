require('dotenv').config();
const pg = require('pg');
const Sequelize=require('sequelize')

const sequelize=new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectModule: pg,
    // dialectOptions: {
    //     ssl: {
    //       require: true,
    //       rejectUnauthorized: false
    //     }
    // },
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    language: 'en'
})

module.exports=sequelize