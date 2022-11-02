const Groups=require('../models/groups')
const Users=require('../models/users')

exports.findGroups=(req, res, next)=>{
    Groups.findAll()
    .then(groups=>{
        let usergroups=[]
        groups.map(group=>{
            let members=JSON.parse(group.members)
            if(members.includes(req.user.id)){
                usergroups.push(group)
            }
        })
        res.status(200).send(usergroups)
    })
}

exports.createGroup=(req, res, next)=>{
    Groups.create(
        {
            name:req.body.name,
            members:JSON.stringify([...req.body.members, req.user.id]),
            admins:JSON.stringify([req.user.id]),
            userId:req.user.id
        }
    ).then(response=>{
        res.status(201).send(response)
    }).catch(err=>console.log(err))
}

exports.getGroup=(req, res, next)=>{
    Groups.findOne({where: {id:req.query.groupId}})
    .then(group=>{
        let members=JSON.parse(group.members)
        Users.findAll({where:{id:members}}).then(users=>{
            let userDetails=[]
            users.map(user=>{
                let obj={
                    id:user.id,
                    name:user.name
                }
                userDetails.push(obj)
            })
            res.status(200).send({group:group, users:userDetails})
        })
    }).catch(err=>console.log(err))
}

exports.addAdmin=(req, res, next)=>{
    Groups.findOne({where:{id:req.body.id}})
    .then(group=>{
        let admins=JSON.parse(group.admins)
        admins.push(req.body.admin)
        group.admins=JSON.stringify(admins)
        group.save().then(response=>{
            res.status(201).send(response)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}

exports.removeAdmin=(req, res, next)=>{
    Groups.findOne({where:{id:req.body.id}})
    .then(group=>{
        let admins=JSON.parse(group.admins)
        admins.splice(admins.indexOf(req.body.admin),1)
        group.admins=JSON.stringify(admins)
        group.save().then(response=>{
            res.status(201).send(response)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}

exports.removeUser=(req, res, next)=>{
    Groups.findOne({where:{id:req.body.id}})
    .then(group=>{
        let members=JSON.parse(group.members)
        members.splice(members.indexOf(req.body.member),1)
        let admins=JSON.parse(group.admins)
        let index=admins.indexOf(req.body.member)
        if (index>-1){
            admins.splice(index, 1)
        }
        group.members=JSON.stringify(members)
        group.admins=JSON.stringify(admins)
        group.save().then(response=>{
            res.status(201).send(response)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}

exports.addUsers=(req, res, next)=>{
    Groups.findOne({where:{id:req.body.id}})
    .then(group=>{
        let members=JSON.parse(group.members)
        members=[...members, ...req.body.users]
        group.members=(JSON.stringify(members))
        group.save().then(response=>{
            res.status(201).send(response)
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}