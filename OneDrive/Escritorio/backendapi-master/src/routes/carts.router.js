import { Router } from 'express';
import Cart from '../dao/mongo/CartMongoDAO.js';

const router = Router();
const cartService = new Cart();

router.get('/', async (req, res, next) => {
  try {
    const carts = await cartService.getAll();
    res.json(carts);
  } catch (err) { next(err); }
});

router.get('/:cid', async (req, res, next) => {
  try {
    const cart = await cartService.getById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const nuevo = await cartService.create();
    res.status(201).json(nuevo);
  } catch (err) { next(err); }
});

router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const actualizado = await cartService.addProduct(req.params.cid, req.params.pid);
    res.json(actualizado);
  } catch (err) { next(err); }
});

router.put('/:cid/product/:pid', async (req, res, next) => {
  try {
    const actualizado = await cartService.updateQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json(actualizado);
  } catch (err) { next(err); }
});

router.delete('/:cid/product/:pid', async (req, res, next) => {
  try {
    await cartService.removeProduct(req.params.cid, req.params.pid);
    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (err) { next(err); }
});
export default router;
