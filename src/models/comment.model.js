const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Comments'
const COLLECTION_NAME = 'Comments'

const commentSchema = new Schema({
    cmt_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    cmt_userId: { type: Number, default: 1},
    cmt_content: { type: String, default: 'text' },
    cmt_left: {type: Number, default: 0 },
    cmt_right: { type: Number, default: 0 },
    cmt_parentId : {type: Schema.Types.ObjectId , ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, commentSchema);

