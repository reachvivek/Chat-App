const express=require('express')
const fs=require('fs')
const bodyParser=require('body-parser')
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const app=express();

app.use(bodyParser.urlencoded({extended:false}))

app.get('/login', (req, res, next)=>{
    res.send(`<form action='/login/user' method='POST'><input type='text' name='username' placeholder='username'></input><br><input type='submit' value='Login'></input></form>`)
})

app.post('/login/user', (req, res, next)=>{
    let user=(req.body.username)
    localStorage.setItem('username', JSON.stringify(user))
    res.redirect('/')
})

app.get('/', (req, res, next)=>{
    fs.readFile('messages.txt', 'utf8', (err, data)=>{
        if(data==undefined){
            res.send(`<p>No chats exist</p><form action='/send' method='POST'><input placeholder='message' type='text' name='message'></input><input type='submit' value='send'></input></form>`)
        }
        else{
            res.send(`<p>${data}</p><form action='/send' method='POST'><input placeholder='message' type='text' name='message'></input><input type='submit' value='send'></input></form>`)
        }
    })
})

app.post('/send', (req,res,next)=>{
    let user=JSON.parse(localStorage.getItem('username'))
    let message=req.body.message
    fs.appendFile('messages.txt', `${user} : ${message} `, err=>console.log(err))
    res.redirect('/')
})

app.listen(3000)