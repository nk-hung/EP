const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const CommentController = require('../../controllers/comment.controller');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

router.use(authentication)

router.post('', asyncHandler(CommentController.createComment))
router.get('', asyncHandler(CommentController.getCommentsByParentId))
router.delete('', asyncHandler(CommentController.deleteComments))

module.exports = router;