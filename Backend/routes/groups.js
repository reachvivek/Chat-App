const express = require('express');

const groupsController = require('../controllers/groups');

const authenticator=require('../controllers/auth')

const router = express.Router();

router.get('/groups', authenticator.authenticate, groupsController.findGroups)

router.post('/groups', authenticator.authenticate, groupsController.createGroup)

module.exports=router;