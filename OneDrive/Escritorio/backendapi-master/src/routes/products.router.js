import { Router } from 'express';
import ProductMongoDAO from '../dao/mongo/ProductMongoDao.js';



const router = Router();
const productDAO = new ProductMongoDAO();

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  try {
    const result = await productDAO.getProducts({ limit, page, sort, query });

    if(result.status === 'error'){
      return res.status(500).json({ status: 'error', error: result.error });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productDAO.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Error al obtener producto' });
  }
});

export default router;
