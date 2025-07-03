import { Router } from 'express';
import Product from '../dao/mongo/ProductMongoDAO.js';

const router = Router();
const productService = new Product();

router.get('/', async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (err) { next(err); }
});

router.get('/:pid', async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const nuevo = await productService.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) { next(err); }
});

router.put('/:pid', async (req, res, next) => {
  try {
    const actualizado = await productService.update(req.params.pid, req.body);
    res.json(actualizado);
  } catch (err) { next(err); }
});

router.delete('/:pid', async (req, res, next) => {
  try {
    await productService.delete(req.params.pid);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) { next(err); }
});

export default router;
