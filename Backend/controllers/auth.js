var jwt = require('jsonwebtoken');
const Users=require('../models/users')

exports.authenticate=(req, res, next)=>{
    try{
        const token=req.header('Authorization')
        const decoded=jwt.verify(token, 'chatAppToken')
        Users.findOne({where: {email:decoded.email}}).then(response=>{
            req.user=response;
            next()
        }).catch(err=>console.log(err))
    }
    catch(err){
        console.log(err);
        return res.status(401)
    }
}