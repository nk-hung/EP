const { SuccessResponse } = require("../core/success.response")
const {createComment, getCommentsByParentId, deleteComment } = require('../services/comment.service')

class CommentController {
   createComment = async  (req, res, next)  => {
    new SuccessResponse({
        message: 'Create new comment',
        metadata: await createComment(req.body)
    }).send(res)
   }

   getCommentsByParentId = async(req, res, next) => {
    new SuccessResponse({
        message: 'Get list comments',
        metadata: await getCommentsByParentId(req.query)
    }).send(res)
   }

   deleteComments = async(req, res, next) => {
    new SuccessResponse({
        message: 'Delete comment',
        metadata: await deleteComment(req.body)
    }).send(res)
   }
}

module.exports = new CommentController()