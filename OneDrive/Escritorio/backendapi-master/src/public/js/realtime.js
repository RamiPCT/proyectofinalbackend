const socket = io();

const addForm = document.getElementById('addForm');
const deleteForm = document.getElementById('deleteForm');
const productList = document.getElementById('productList');

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const product = Object.fromEntries(formData);
  product.price = Number(product.price);
  product.stock = Number(product.stock);
  product.thumbnails = [product.thumbnails];
  socket.emit('addProduct', product);
  addForm.reset();
});

deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(deleteForm);
  const id = formData.get('id');
  socket.emit('deleteProduct', id);
  deleteForm.reset();
});

socket.on('updateProducts', products => {
  productList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.title} - $${p.price}`;
    productList.appendChild(li);
  });
});
