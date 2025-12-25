import Product from '../models/Product.js';
import fs from 'fs/promises';
import path from 'path';
import { fetchDocuments } from '../utils/queryHelper.js';
import { PRODUCT_MESSAGES, formatProductMessage } from '../utils/productMessages.js';

// Predefined categories list
const VALID_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys'
];

export class ProductService {
  static async createProduct(productData, file) {
    const { title, description, stock, category, price } = productData;

    // Validate required fields
    if (!file) {
      throw new Error(PRODUCT_MESSAGES.IMAGE_REQUIRED);
    }

    if (!title || !description || stock === undefined || !category || price === undefined) {
      throw new Error(PRODUCT_MESSAGES.ALL_FIELDS_REQUIRED);
    }

    // Parse and validate numeric fields
    const parsedStock = parseInt(stock, 10);
    const parsedPrice = Number(parseFloat(price).toFixed(2));

    if (isNaN(parsedStock) || parsedStock < 0) {
      throw new Error(PRODUCT_MESSAGES.STOCK_NUMERIC);
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error(PRODUCT_MESSAGES.PRICE_NUMERIC);
    }

    // Use path.join for OS-safe path handling, then normalize to forward slashes
    let imagePath = path.join('uploads', 'products', file.filename);
    imagePath = imagePath.replace(/\\/g, '/');

    // Use .trim() for cleaner string data
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanCategory = category.trim();

    // Normalize input and categories to lowercase for comparison
    const normalizedCategory = cleanCategory.toLowerCase();
    const normalizedCategories = VALID_CATEGORIES.map(cat => cat.toLowerCase());

    // Validate category
    if (!normalizedCategories.includes(normalizedCategory)) {
      // Delete uploaded image
      await fs.unlink(file.path);
      throw new Error(formatProductMessage(PRODUCT_MESSAGES.CATEGORY_INVALID, {
        categories: VALID_CATEGORIES.join(', ')
      }));
    }

    // Validate title and description length
    if (cleanTitle.length < 3 || cleanTitle.length > 100) {
      throw new Error(PRODUCT_MESSAGES.TITLE_LENGTH);
    }

    if (cleanDescription.length < 10 || cleanDescription.length > 1000) {
      throw new Error(PRODUCT_MESSAGES.DESCRIPTION_LENGTH);
    }

    try {
      // Create product with image path
      const product = await Product.create({
        title: cleanTitle,
        description: cleanDescription,
        image: imagePath,
        stock: parsedStock,
        category: cleanCategory,
        price: parsedPrice
      });

      return product;
    } catch (error) {
      // If product creation fails, delete uploaded image
      if (file) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }

      // Re-throw the error to be handled by the controller
      throw error;
    }
  }

  static getValidCategories() {
    return VALID_CATEGORIES;
  }

  static async updateProduct(productId, updateData, file) {
    const product = await Product.findById(productId);
    if (!product) {
      if (file) await fs.unlink(file.path);
      throw new Error(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
    }

    // Capture old data before update for comparison
    const oldData = product.toObject();

    // Handle new image upload
    if (file) {
      // Delete old image if it exists
      if (product.image) {
        try {
          const oldImagePath = path.join(process.cwd(), product.image);
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      let imagePath = path.join('uploads', 'products', file.filename);
      updateData.image = imagePath.replace(/\\/g, '/');
    }

    // Normalize category if provided
    if (updateData.category) {
      updateData.category = updateData.category.trim();
      const normalizedCategory = updateData.category.toLowerCase();
      const normalizedCategories = VALID_CATEGORIES.map(cat => cat.toLowerCase());

      if (!normalizedCategories.includes(normalizedCategory)) {
        if (file) await fs.unlink(file.path);
        throw new Error(formatProductMessage(PRODUCT_MESSAGES.CATEGORY_INVALID, {
          categories: VALID_CATEGORIES.join(', ')
        }));
      }
    }

    // Clean other fields
    if (updateData.title) updateData.title = updateData.title.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.stock) updateData.stock = parseInt(updateData.stock, 10);
    if (updateData.price) updateData.price = Number(parseFloat(updateData.price).toFixed(2));

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    return { updatedProduct, oldData };
  }

  static async deleteProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
    }

    const deletedData = product.toObject();

    // Delete associated image file
    if (product.image) {
      try {
        const imagePath = path.join(process.cwd(), product.image);
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting product image:', error);
      }
    }

    await Product.findByIdAndDelete(productId);
    return deletedData;
  }
}

export const getProducts = async (role, userId, queryParams) => {
  return await fetchDocuments(Product, {
    search: queryParams.search, // search string
    searchFields: ['title', 'description', 'category'], // searchable fields
    query: {} // additional filters if needed
  }, { role, userId });
};