const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

router.get('/shop/login', asyncHandler(accessController.login));
router.post('/shop/signup', asyncHandler(accessController.signUp));

/* Authentication*/
router.use(authentication);
// logout

router.post('/shop/logout', accessController.logout);
router.post('/shop/handlerRefreshToken', accessController.handlerRefreshToken);
module.exports = router;
