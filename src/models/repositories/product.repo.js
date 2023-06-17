const { Types } = require('mongoose');
const { NotFoundError } = require('../../core/error.response');
const {
  product,
  electronics,
  clothing,
  furnitures,
} = require('../product.model');
const { query } = require('express');
const { getSelectData, unGetSelectData } = require('../../utils');

const findAllDraftForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate('product_shop', 'user email -_id')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllPublishForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate('product_shop', 'user email -_id')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  // full text search
  const result = await product
    .find(
      {
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: 'textScore' },
      }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return result;
};

const findAllProducts = async ({ limit, page, filter, sort, select }) => {
  console.log('select:::', select);
  const skip = (page - 1) * limit;
  const sortBy = sort == 'ctime' ? { _id: -1 } : { _id: 1 };
  console.log('select Data::', getSelectData(select));
  const result = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return result;
};

const findProduct = async ({ product_id, unSelect }) => {
  const result = await product
    .findOne({ _id: product_id })
    .select(unGetSelectData(unSelect))
    .lean();

  return result;
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOne({
    product_shop: Types.ObjectId(product_shop),
    _id: Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
