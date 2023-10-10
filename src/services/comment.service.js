
const { NotFoundError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { convertStringToObjectId } = require('../utils');
const { findProduct } = require('./product.service');

class CommentService {
    /*
        Feature: 
        * add comment [User, Shop]
        * get a list a comments [User, Shop]
        * delete a comment [User, Shop, Admin]
    */
   static async createComment({ 
    productId, userId, content, parentCommentId = null
   }){

    const comment = new Comment({
        cmt_productId: productId,
        cmt_userId: userId,
        cmt_content: content,
        cmt_parentId: parentCommentId
    })

    let rightValue;
    if (parentCommentId) {
        // reply comment
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) throw new NotFoundError('Parent comment not found!');
        console.log('parent', parentComment)
        rightValue = parentComment.cmt_right;

        // update Many
        await Comment.updateMany({
            cmt_productId: convertStringToObjectId(productId),
            cmt_right: { $gte: rightValue }
        }, {
            $inc: { cmt_right: 2 }
        })

        await Comment.updateMany({
            cmt_productId: convertStringToObjectId(productId),
            cmt_left: { $gt: rightValue }
        }, {
            $inc: { cmt_left: 2 }
        })
    } else {
        const maxRightValue = await Comment.findOne({
            cmt_productId: convertStringToObjectId(productId)
        }, 'cmt_right', {
            sort: {
                cmt_right: -1
            }
        })    

        if (maxRightValue) {
            rightValue = maxRightValue.cmt_right + 1
        } else {
            rightValue = 1
        }
    }

    // insert to comment
    comment.cmt_left = rightValue;
    comment.cmt_right = rightValue + 1 ;
   
    await comment.save();
    return comment;
   }


   static async getCommentsByParentId({ parentCommentId, productId , limit = 50, offset= 0 }) {
    if (parentCommentId) {
        const parent = await Comment.findById(parentCommentId);
        if (!parent) throw new NotFoundError('Not found commnet for product');
        const comments = await Comment.find({
            cmt_productId: convertStringToObjectId(productId),
            cmt_left: {$gt: parent.cmt_left},
            cmt_right: {$lte: parent.cmt_right }
        }).select({
            cmt_left: 1, cmt_right: 1, cmt_content: 1, cmt_parentId: 1
        }).sort({
            cmt_left: 1
        })

        return comments
    }
        const comments = await Comment.find({
            cmt_productId: convertStringToObjectId(productId),
            cmt_parentId: parentCommentId
        }).select({
            cmt_left: 1, cmt_right: 1, cmt_content: 1, cmt_parentId: 1
        }).sort({
            cmt_left: 1
        })
        return comments
   }

   static async deleteComment({ commentId, productId }) {
    // check product exist 
    const foundProduct = await findProduct({
        product_id: productId
    })
    if (!foundProduct) throw new NotFoundError('Product not exist!');
    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError('Comment not found!');
    // 1. Xac dinh gia tri left va right of comments
    const leftValue = comment.cmt_left
    const rightValue = comment.cmt_right
    // 2. Tinh width
    const width = rightValue - leftValue + 1;
    // 3. delete comment in 
    await Comment.deleteMany({
        cmt_productId: convertStringToObjectId(productId),
        cmt_left: {
            $gte: leftValue
        },
        cmt_right: {
            $lte: rightValue
        }
    })
    // 4. update left, right
    await Comment.updateMany({
        cmt_productId: convertStringToObjectId(productId),
        cmt_right: {
            $gt: rightValue
        }
    }, {
        $inc: {
            cmt_right: -width
        }
    })
    
    await Comment.updateMany({
        cmt_productId: convertStringToObjectId(productId),
        cmt_left: {$gt: rightValue}
    }, {
        $inc: { cmt_left: -width}
    })
    
    return true;
   }

}

module.exports = CommentService;