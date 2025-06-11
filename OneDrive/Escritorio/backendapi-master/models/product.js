// models/product.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  status: { type: Boolean, default: true },
  code: { type: String, unique: true },
  stock: { type: Number, default: 0 },
  thumbnails: [String]
});

productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model('Product', productSchema);
