import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: String
});

const ProductModel = mongoose.model('Product', productSchema);

export default class ProductMongoDAO {
  async getAll() {
    return await ProductModel.find();
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async create(data) {
    return await ProductModel.create(data);
  }

  async update(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}
