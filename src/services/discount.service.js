const { Types } = require('mongoose');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const discount = require('../models/discount.model');
const { findAllProducts } = require('../models/repositories/product.repo');
const {
    getAllDiscountCodesUnselect,
    checkDiscountExists,
} = require('../models/repositories/discount.repo');
/*
    Discount Services
    1- Generator Discount Code [ Shop | Admin ]
    2- Get discount amount [ User ]
    3- Get all discount codes [ User | Shop ]
    4- Verify the code [ user ]
    5- Delete discount code [ Admin | User ]
    6- Cancel discount code [ user ]
*/

// Note: viet handle 1 service hoac controller thi nen su dung builder pattern

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
        } = payload;
        // check
        if (
            new Date() < new Date(start_date) ||
            new Date() > new Date(end_date)
        ) {
            throw new BadRequestError('Discount code has expried!');
        }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError(
                'Start date must be set before end date!!!'
            );
        }

        // create index for discount code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: Types.ObjectId(shopId),
            })
            .lean();

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!');
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(to_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user, // so luong cho phep toi da duoc su dung moi nguoi dung
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        });
        return newDiscount;
    }

    static async updateDiscountCode() {}

    /**
     * Get all discount codes available with products
     */

    static async getAllDiscountCodeWithProduct({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {
        // create index for discount code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: Types.ObjectId(shopId),
            })
            .lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists!');
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;

        if (discount_applies_to === 'all') {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: Types.ObjectId(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            });
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            });
        }
    }

    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await getAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: Types.ObjectId(shopId),
                discount_is_active: true,
            },
            model: discount,
            unSelect: ['__V'],
        });

        return discounts;
    }

    /**
        Apply Discount code
        products = { productId, shopId, quantity, name,price} []
     */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: Types.ObjectId(shopId),
            },
        });
        if (!foundDiscount) throw new NotFoundError('Discount does not exist!');

        // use destructuring
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_user_used,
            discount_max_uses_per_user,
        } = foundDiscount;
        if (!discount_is_active) {
            throw new NotFoundError('Discount expried!!');
        }

        if (!discount_max_uses) throw new NotFoundError('Discount are out!');
        if (
            new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        ) {
            throw new NotFoundError('Discount code has expried!');
        }

        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce(
                (acc, product) => acc + product.quantity * product.price,
                0
            );

            if (totalOrder < discount_min_order_value)
                throw new NotFoundError(
                    `Discount require a minimun order value of ${discount_min_order_value}`
                );
        }
        if (discount_max_uses_per_user > 0) {
            const userUseDiscount = discount_user_used.find(
                (user) => user.userId === userId
            );
            if (userUseDiscount) {
            }
        }

        // check xem discount nay la fixed_amount hay
        const amount =
            discount_type === 'fixed_amount'
                ? discount_value
                : totalOrder * (discount_value / 100);
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        // TH phức tạp thì xem xét code này có đang được sử dụng ở đâu ko?
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: Types.ObjectId(shopId),
        });

        return deleted;
    }

    /* Cancel Discount Code */
    static async cancelDiscountCode({ shopId, codeId, userId }) {
        const foundDiscount = checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: Types.ObjectId(shopId),
            },
        });

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            },
        });
        return result;
    }
}

module.exports = DiscountService;
