const express = require('express');

const usersController = require('../controllers/user');
// const authenticator=require('../controllers/auth')
// const mailer=require('../controllers/mailer')

const router = express.Router();

router.get('/users/:creds', usersController.findUser)

router.post('/users', usersController.createUser)

module.exports=router;