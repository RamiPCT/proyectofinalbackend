import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('home', { title: 'Henko - Inicio' });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Henko - Productos en tiempo real' });
});

export default router;
