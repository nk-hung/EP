const express = require('express');
const NotificationController = require('../../controllers/notification.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.use(authentication)
router.get('',  asyncHandler(NotificationController.listNotiByUser))

module.exports = router;