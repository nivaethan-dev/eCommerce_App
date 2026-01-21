import { ProductService, getProducts } from '../services/productService.js';
import * as productTriggers from '../eventTriggers/productEvent.js';
import { PRODUCT_MESSAGES } from '../utils/productMessages.js';
import { formatErrorResponse, isSafeMessage, isProduction } from '../utils/errorUtils.js';
import { getClientIp } from '../utils/geoipUtils.js';

// List of safe product-related error messages that can be shown to users
const SAFE_PRODUCT_ERRORS = [
  PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
  PRODUCT_MESSAGES.DUPLICATE_PRODUCT,
  PRODUCT_MESSAGES.IMAGE_REQUIRED,
  PRODUCT_MESSAGES.ALL_FIELDS_REQUIRED,
  PRODUCT_MESSAGES.STOCK_NUMERIC,
  PRODUCT_MESSAGES.PRICE_NUMERIC,
  PRODUCT_MESSAGES.TITLE_LENGTH,
  PRODUCT_MESSAGES.DESCRIPTION_LENGTH,
  PRODUCT_MESSAGES.CATEGORY_INVALID
];

export const createProduct = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body, req.file);

    // Trigger product created event (audit log + admin notification)
    await productTriggers.triggerProductCreated(
      product._id,
      product.title,
      req.user.id,
      getClientIp(req)
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

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const { statusCode, response } = formatErrorResponse(error);
      return res.status(statusCode).json(response);
    }

    // Handle known safe product error messages from service
    if (error.message && isSafeMessage(error.message, SAFE_PRODUCT_ERRORS)) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // For unknown errors, use safe error handling
    if (!isProduction()) {
      console.error('Product creation error:', error);
    }
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Debug logging (only in development)
    if (!isProduction()) {
      console.log('Update Product Request:');
      console.log('Product ID:', productId);
      console.log('Request Body:', req.body);
      console.log('File:', req.file ? { filename: req.file.filename, cloudinaryUrl: req.file.cloudinaryUrl } : 'No file');
    }
    
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
      getClientIp(req)
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

    // Handle known safe error: Product not found
    if (error.message === PRODUCT_MESSAGES.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, error: error.message });
    }

    // Handle other known safe product errors
    if (error.message && isSafeMessage(error.message, SAFE_PRODUCT_ERRORS)) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // For unknown errors, use safe error handling
    if (!isProduction()) {
      console.error('Update product error:', error);
    }
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
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
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.DELETE_SUCCESS,
      data: { _id: productId }
    });
  } catch (error) {
    // Handle known safe error: Product not found
    if (error.message === PRODUCT_MESSAGES.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, error: error.message });
    }

    // For unknown errors, use safe error handling
    if (!isProduction()) {
      console.error('Delete product error:', error);
    }
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductService.getProductById(productId);
    res.status(200).json({
      success: true,
      message: PRODUCT_MESSAGES.FETCH_SUCCESS,
      data: product
    });
  } catch (error) {
    // Handle known safe error: Product not found
    if (error.message === PRODUCT_MESSAGES.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, error: error.message });
    }
    
    // For unknown errors, use safe error handling
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};

export const fetchProducts = async (req, res) => {
  try {
    // Allow public access for product search - no authentication required
    const role = req.user ? req.user.role : 'public';
    const userId = req.user ? req.user.id : null;
    // Use validatedQuery if available (search is already regex-escaped by middleware)
    const queryParams = req.validatedQuery || req.query;
    const { products, page, limit, total, totalPages } = await getProducts(role, userId, queryParams);
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
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};

export const fetchProductCategories = async (req, res) => {
  try {
    // Public endpoint: categories are a static whitelist in ProductService
    const categories = ProductService.getValidCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};
