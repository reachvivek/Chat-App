const Chats=require('../models/chats')
const { Op } = require("sequelize");

exports.getChats=(req, res, next)=>{
    console.log(req.query)
    if(req.query.lastId){
        Chats.findAll({
            where:{
                id:{
                    [Op.gt]:parseInt(req.query.lastId)
                },
                groupId:parseInt(req.query.groupId)
            }
        }).then(response=>{
            res.status(200).send(response)
        }).catch(err=>console.log(err))
    }else{
        Chats.findAll({where: {groupId:req.query.groupId}}).then(response=>{
            res.status(200).send(response)
        }).catch(err=>console.log(err))
    }
}

exports.postChat=(req, res, next)=>{
    console.log(req.user.id)
    Chats.create({
        name:req.user.name,
        message:req.body.message,
        userId:req.user.id,
        groupId:req.body.groupId
    }).then(response=>{
        res.status(201).send(response)
    }).catch(err=>console.log(err))
}