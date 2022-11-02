const express = require('express');

const groupsController = require('../controllers/groups');

const authenticator=require('../controllers/auth')

const router = express.Router();

router.get('/groups', authenticator.authenticate, groupsController.findGroups)

router.get('/group', authenticator.authenticate, groupsController.getGroup)

router.put('/addAdmin', authenticator.authenticate, groupsController.addAdmin)

router.put('/removeAdmin', authenticator.authenticate, groupsController.removeAdmin)

router.put('/removeUser', authenticator.authenticate, groupsController.removeUser)

router.put('/addUsers', authenticator.authenticate, groupsController.addUsers)

router.post('/groups', authenticator.authenticate, groupsController.createGroup)

module.exports=router;