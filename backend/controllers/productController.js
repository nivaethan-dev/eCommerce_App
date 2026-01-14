import { ProductService, getProducts } from '../services/productService.js';
import * as productTriggers from '../eventTriggers/productEvent.js';
import { PRODUCT_MESSAGES } from '../utils/productMessages.js';

export const createProduct = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body, req.file);

    // Trigger product created event (audit log + admin notification)
    await productTriggers.triggerProductCreated(
      product._id,
      product.title,
      req.user.id,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: PRODUCT_MESSAGES.CREATE_SUCCESS,
      data: product
    });
  } catch (error) {
    // Check for duplicate product
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: PRODUCT_MESSAGES.DUPLICATE_PRODUCT
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle custom validation errors from service
    if (error.message) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      error: PRODUCT_MESSAGES.CREATE_FAILED
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Debug logging
    console.log('Update Product Request:');
    console.log('Product ID:', productId);
    console.log('Request Body:', req.body);
    console.log('File:', req.file ? { filename: req.file.filename, cloudinaryUrl: req.file.cloudinaryUrl } : 'No file');
    
    const { updatedProduct, oldData } = await ProductService.updateProduct(productId, req.body, req.file);

    // Trigger product updated event (audit log + admin notification)
    // Pass oldData and the specific updates (req.body + file change if any)
    const changes = { ...req.body };
    if (req.file) changes.image = '(updated)'; // Mark image as changed

    await productTriggers.triggerProductUpdated(
      updatedProduct._id,
      updatedProduct.title,
      oldData,
      updatedProduct.toObject(), // Send full new object for diff calculation
      req.user.id,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.UPDATE_SUCCESS,
      data: updatedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: PRODUCT_MESSAGES.DUPLICATE_PRODUCT
      });
    }

    console.error('Update product error:', error);
    if (error.message === PRODUCT_MESSAGES.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(400).json({ success: false, error: error.message || PRODUCT_MESSAGES.UPDATE_FAILED });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedData = await ProductService.deleteProduct(productId);

    // Trigger product deleted event (audit log + admin notification)
    await productTriggers.triggerProductDeleted(
      productId,
      deletedData.title,
      deletedData, // Pass full snapshot of deleted data
      req.user.id,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.DELETE_SUCCESS,
      data: { _id: productId }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.message === PRODUCT_MESSAGES.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message || PRODUCT_MESSAGES.DELETE_FAILED });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    // Allow public access for product search - no authentication required
    const role = req.user ? req.user.role : 'public';
    const userId = req.user ? req.user.id : null;
    const { products, page, limit, total, totalPages } = await getProducts(role, userId, req.query);
    res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.FETCH_SUCCESS,
      products,
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchProductCategories = async (req, res) => {
  try {
    // Public endpoint: categories are a static whitelist in ProductService
    const categories = ProductService.getValidCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
