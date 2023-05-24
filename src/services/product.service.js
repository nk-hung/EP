const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothing,
  electronics,
  furnitures,
} = require('../models/product.model');

class ProductFactory {
  // provides an interface for creating objects in a super-class
  // use Strategy pattern de tuan thu tinh Close/Open principle

  static productRegister = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegister(type);
    if (!productClass) throw new BadRequestError(`Invaild Type ::: ${type}`);

    return new productClass(payload).createProduct();
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
    return await product.create({ ...this, _id: productId });
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
    if (!newClothing) throw new BadRequestError('create new Clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      await clothing.deleteOne({ _id: newClothing._id });
      throw new BadRequestError('create new Product error');
    }

    return newProduct;
  }
}

class Electronics extends Product {
  static async createProduct() {
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError('create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      await electronics.deleteOne({ _id: newElectronic._id });
      throw new BadRequestError('create new Product error');
    }

    return newElectronic;
  }
}

class Furnitures extends Product {
  static async createProduct() {
    const newFurnitures = await furnitures.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurnitures)
      throw new BadRequestError('create new Furnitures error');

    const newProduct = await super.createProduct(newFurnitures._id);
    if (!newProduct) {
      await furnitures.deleteOne({ _id: newFurnitures._id });
      throw new BadRequestError('create new Product error');
    }

    return newFurnitures;
  }
}
// register product type

ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furnitures);

module.exports = ProductFactory;
