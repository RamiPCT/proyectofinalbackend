
import { Cart } from '../../models/carts.js';

export default class CartMongoDAO {
  async createCart() {
    const cart = new Cart({ products: [] });
    await cart.save();
    return cart.toObject();
  }

  async getCartByIdPopulated(cid) {
    return await Cart.findById(cid).populate('products.product').lean();
  }

  async addProductToCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart.toObject();
  }

  async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart.toObject();
  }

  async updateCartProducts(cid, newProducts) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = newProducts.map(p => ({
      product: p.product,
      quantity: p.quantity || 1
    }));

    await cart.save();
    return cart.toObject();
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) return null;

    productInCart.quantity = quantity;
    await cart.save();
    return cart.toObject();
  }

  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart.toObject();
  }
}
