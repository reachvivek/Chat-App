const Groups=require('../models/groups')

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
            userId:req.user.id
        }
    ).then(response=>{
        res.status(201).send(response)
    }).catch(err=>console.log(err))
}