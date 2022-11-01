const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Groups=sequelize.define('groups', {
    id:{
        type: Sequelize.INTEGER,
        allowedNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowedNull:false
    },
    members:{
        type:Sequelize.TEXT,
        allowedNull:false
    }
})

module.exports=Groups;