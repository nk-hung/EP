const { convertStringToObjectId } = require('../../utils');
const { cart } = require('../cart.model');

const getCartById = async (cartId) => {
    return await cart
        .findOne({ _id: convertStringToObjectId(cartId), cart_state: 'active' })
        .lean();
};

module.exports = {
    getCartById,
};
