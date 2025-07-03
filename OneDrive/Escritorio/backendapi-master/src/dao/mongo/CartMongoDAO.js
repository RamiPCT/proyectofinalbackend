import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
});

const CartModel = mongoose.model('Cart', cartSchema);

export default class CartMongoDAO {
  async getAll() {
    return await CartModel.find().populate('products.product');
  }

  async getById(id) {
    return await CartModel.findById(id).populate('products.product');
  }

  async create() {
    return await CartModel.create({ products: [] });
  }

  async addProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product.equals(productId));
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId });
    }

    return await cart.save();
  }

  async updateQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const prod = cart.products.find(p => p.product.equals(productId));
    if (!prod) return null;

    prod.quantity = quantity;
    return await cart.save();
  }

  async removeProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => !p.product.equals(productId));
    return await cart.save();
  }
}
