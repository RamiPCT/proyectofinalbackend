import { Router } from 'express';
import CartMongoDAO from '../dao/mongo/CartMongoDAO.js';

const router = Router();
const cartDAO = new CartMongoDAO();

router.post('/', async (req, res) => {
  try {
    const cart = await cartDAO.createCart();
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Error al crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.getCartByIdPopulated(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.render('cartDetail', { cart });
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Error al obtener el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartDAO.addProductToCart(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Error al agregar producto al carrito' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await cartDAO.removeProductFromCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', error: 'El cuerpo debe contener un array de productos' });
    }
    const cart = await cartDAO.updateCartProducts(req.params.cid, products);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', message: 'Carrito actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await cartDAO.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado o producto no está en el carrito' });
    res.json({ status: 'success', message: 'Cantidad actualizada' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.clearCart(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    res.json({ status: 'success', message: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

export default router;
