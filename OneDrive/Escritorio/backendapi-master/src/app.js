import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io';
import __dirname from './utils.js';

// Routers
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const PORT = 8080;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/henko-ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🟢 Conectado a MongoDB'))
.catch(err => console.log('🔴 Error en conexión a MongoDB', err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Servidor y Socket.io
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
const io = new Server(server);
app.set('io', io);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Middleware de errores generales
app.use((err, req, res, next) => {
  console.error('🔥 Error general:', err);
  res.status(500).render('500', { title: 'Error en el servidor' });
});

// Cierre limpio del servidor
process.on('SIGINT', async () => {
  console.log('\n🔴 Cerrando servidor...');
  await mongoose.disconnect();
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});
