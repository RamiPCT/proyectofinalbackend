import { Product } from '../../models/products.js';

export default class ProductMongoDAO {
  async getProducts({ limit = 10, page = 1, sort = null, query = {} }) {
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
      lean: true,
    };

    const filter = query ? { category: query } : {};

    const result = await Product.paginate(filter, options);
    return result;
  }

  async getProductById(pid) {
    return await Product.findById(pid).lean();
  }

  async create(productData) {
    const product = new Product(productData);
    await product.save();
    return product.toObject();
  }

  async update(pid, updateData) {
    const product = await Product.findByIdAndUpdate(pid, updateData, { new: true });
    return product?.toObject();
  }

  async delete(pid) {
    return await Product.findByIdAndDelete(pid);
  }
}
