const { SChema, model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Notifications';
const COLLECTION_NAME = 'Notifications';

// Order ==> ORDER-001: order success
// ORDER-002: order failed
// PROMOTION-001: new PROMOTION
// SHOP-001: new product by User following

const notificationSchema = new Schema({
    noti_type: { 
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        required: true
    },
    noti_senderId: {type: Schema.Types.ObjectId, required: true },
    noti_receiveId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    Notification: model(DOCUMENT_NAME, notificationSchema)
}