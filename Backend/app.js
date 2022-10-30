const express = require('express')
const bodyParser = require('body-parser')
const cors=require('cors')
const helmet = require('helmet')

const sequelize=require('./util/database')
const userRoutes=require('./routes/user')

const app=express();

app.use(cors())
app.use(helmet())

app.use(bodyParser.json({extended:false}))
app.use(bodyParser.urlencoded({extended:false}))

app.use(userRoutes)

sequelize.sync().then(response=>{
    console.log(response)
    app.listen(process.env.PORT || 3000, ()=>console.log("Server started running on Port: 3000"))
}).catch(err=>console.log(err))

