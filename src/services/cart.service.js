/*
    Key features: Cart Service
        1. Add product to Cart [User]
        2. Reduce product quantity [User]
        3. Increase product quantity [User]
        4. Get list Cart [User]
        5. Delete Cart [User]
        6. Delete Cart Item [User]
*/

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
    
    static async createUserCart({ userId , product }) {
        const query = {cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = { upsert: true, new: true}

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    
    static async updateUserCartQuantity({userId, product}) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                  'cart_products.$.quantity': quantity // $ dai dien update chinh phan tu phia sau
            }
        }, options= { upsert: true, new: true }
        
        return await cart.findOneAndUpdate(query, updateSet, options)
    }


    static async addToCart({ userId, product = []}) { 
        // check cart existed not yet?
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // create cart for User
            return await CartService.createUserCart({ userId, product })
        }

        // neu co cart roi nhung chua co san pham?
        if (userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        // gio hang ton tai, va co san pham nay thi update quantity

        return await CartService.updateUserCartQuantity({ userId, product })
    }

    /* update cart
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity, price, shopId, old_quantity, productId
                    }
                ],
                version: // Dung trong Khoa lac quan va khoa bi quan va khoa phan tan
            }
        ]
    */

    static async addToCartV2({ userId, product = []}) {
        const {productId, quantity, old_quantity} = product.shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductById({productId}) 
        if(!foundProduct) throw new NotFoundError('Product not exist');
        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop');
        }

        if (quantity === 0 ) {
            // delete => service del
        }
        
        return await CartService.updateUserCartQuantity({
            userId, 
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
}

module.exports = CartService