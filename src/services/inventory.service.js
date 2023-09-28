const { BadRequestError } = require("../core/error.response")
const { inventory } = require("../models/inventory.model")
const { product } = require("../models/product.model")
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToInventory ({
        stock,
        productId,
        shopId,
        location = 'HCM'
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError("Product does not exists!")
        const query = { inven_shopId: shopId, inven_productId: productId},
        updateSet = {
            $inc: {inven_stock: stock},
            $set: { inven_location: location }
        }, options= { upsert: true, new: true }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService