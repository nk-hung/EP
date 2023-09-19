const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Discount';
const DOCUMENT_NAME = 'discounts'

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_type: { type: String, default: 'fixed_amount' },
        discount_value: { type: Number, required: true },
        discount_code: { type: String, required: true }, // voucher
        discount_start_date: {type: Date, required: true}, // ngay bat dau
        discount_end_date : { type: Date, required: true }, // ngay ket thuc
        discount_max_uses: {type: Number, required: true}, // so luong discount duoc ap dung
        discount_uses_count: { type: Number, required: true}, // so discout da duoc su dung
        discount_users_used: { type: Array, default: []},
        discount_max_uses_per_user: { type: Number, required: true}, // so luong cho phep toi da duoc su dung moi nguoi dung
        discount_min_order_value: {type: Number, required: true},
        discount_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},
        discount_is_active: {type: Boolean, required: true},
        discount_applies_to: {type: String, required: true, enum: ['all', 'specific']},
        discount_product_ids: {type: Array, default: []}, // so san pham duoc ap dung
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports =  model(DOCUMENT_NAME, discountSchema)

// Note: không nên thêm trường để đánh dấu là xóa hay chưa vì mất thêm việc đánh index