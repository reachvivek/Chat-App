const Users=require('../models/users')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function generateToken(email){
    return (jwt.sign({email:email}, 'chatAppToken'))
}

exports.createUser=(req, res, next)=>{
    console.log(req.body)
    bcrypt.hash(req.body.password, saltRounds).then((hash)=>{
        console.log(hash)
        Users.findOrCreate({
            where: {email:req.body.email},
            defaults: {
                name: req.body.name,
                phone:req.body.phone,
                password: hash,
        }}).then(response=>{
            res.status(201).send(response)
        }).catch(err=>console.log(err))
    });
}

exports.findUser=(req, res, next)=>{
    const creds=JSON.parse(req.params.creds)
    Users.findOne({where: {email:creds.email}})
    .then(response=>{
        if (response==null || response==''){
            res.status(200).send({code:0})
        }else{
            bcrypt.compare(creds.password, response.password).then((result)=>{
                if(result){
                    res.status(200).send({code:1, token:generateToken(creds.email), userId:response.id})
                }else{
                    res.status(200).send({code:2})
                }
            });
        }
    }).catch(err=>console.log(err))
}

exports.getUsers=(req, res, next)=>{
    Users.findAll().then(response=>{
        let data=[]
        if (response.length>0){
            response.map(user=>{
                let entry={id:user.id, name:user.name}
                data.push(entry)
            })
        }
        res.status(200).send(data)
    }).catch(err=>console.log(err))
}
