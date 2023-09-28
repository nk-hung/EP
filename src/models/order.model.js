const {model, Schema } = require('mongoose')

const COLLECTION_NAME = 'Order';
const DOCUMENT_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout: {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_shipping: { type: Object, default: {}},
    /*
        order_shipping: {
            street,
            city,
            state,
            country,
            zipcode
        }
    */
   order_payment: {type: Object, default: {}},
   order_products: { type: Array, reuqire: true}, // == shop_order_ids_new
   order_tracking_number: { type: String, default: '#0000128092023'},
    order_status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], 
        default: 'pending'
    }
}, {
    collection: COLLECTION_NAME,
    createdAt: 'createdOn',
    timestamps: {
        updatedAt: 'modifiedOn'
    },
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}