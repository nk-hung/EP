const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronics,
  furnitures,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

class ProductFactory {
  // provides an interface for creating objects in a super-class
  // use Strategy pattern de tuan thu tinh Close/Open principle

  static productRegister = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass) throw new BadRequestError(`Invaild Type ::: ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass) throw new BadRequestError(`Invalid Type::: ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    console.log("args", product_shop, product_id);
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // query
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async getAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      page,
      filter,
      sort,
      select: [
        "product_name",
        "product_description",
        "product_price",
        "product_shop",
      ],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}

// define base class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      // add Product in inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });

      // add noti to system << Sau nay se la 1 mircoservice >>
      pushNotiToSystem({
        type: "SHOP-001",
        receiveId: 1, // tu type => query lay array receive
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((rs) => console.log(rs))
        .catch(console.error);
    }

    return newProduct;
  }

  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}

// define sub-class
class Clothing extends Product {
  // but allow subclass to after the type of object that will be created
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      await clothing.deleteOne({ _id: newClothing._id });
      throw new BadRequestError("create new Product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = this;

    if (objectParams.product_attributes) {
      // update clothing
      await updateProductById({
        productId,
        bodyUpdate: objectParams,
        model: clothing,
      });
    }

    // update product
    const updateProduct = super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      await electronics.deleteOne({ _id: newElectronic._id });
      throw new BadRequestError("create new Product error");
    }

    return newProduct;
  }
}

class Furnitures extends Product {
  async createProduct() {
    console.log(`this:::`, this);
    const newFurnitures = await furnitures.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurnitures)
      throw new BadRequestError("create new Furnitures error");

    const newProduct = await super.createProduct(newFurnitures._id);
    if (!newProduct) {
      await furnitures.deleteOne({ _id: newFurnitures._id });
      throw new BadRequestError("create new Product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: furnitures,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams),
    );

    return updateProduct;
  }
}
// register product type

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furnitures);

module.exports = ProductFactory;
