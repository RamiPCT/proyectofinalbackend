import { Router } from 'express';
import Product from '../../../models/product.js';
import { Cart } from '../../../models/carts.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status !== undefined) filter.status = status === 'true';

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
    };

    if (sort === 'asc') options.sort = { price: 1 };
    else if (sort === 'desc') options.sort = { price: -1 };

    const result = await Product.paginate(filter, options);

    res.render('products', {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      query: req.query,
    });
  } catch (error) {
    res.status(500).send('Error cargando productos');
  }
});

router.get('/cart/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Error cargando carrito');
  }
});

export default router;
