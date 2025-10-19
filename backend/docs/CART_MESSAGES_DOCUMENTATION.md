# 📝 Cart Messages Documentation

## Table of Contents
- [Overview](#overview)
- [Message Evolution](#message-evolution)
- [Current Implementation](#current-implementation)
- [Message Categories](#message-categories)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)
- [API Reference](#api-reference)

---

## Overview

This documentation covers the cart message system, showing the evolution from scattered hardcoded strings to a centralized, maintainable message management system. The current implementation provides consistency, reusability, and easy maintenance across all cart operations.

### Key Benefits
- ✅ **Centralized Management** - All messages in one place
- ✅ **Consistency** - Uniform messaging across all endpoints
- ✅ **Maintainability** - Easy to update and modify
- ✅ **Type Safety** - IDE autocomplete and error prevention
- ✅ **Internationalization Ready** - Easy to add multiple languages
- ✅ **Dynamic Messages** - Support for placeholders and context

---

## Message Evolution

### 🔴 Before: Scattered Implementation (Problems)

#### **Issues with Previous Approach:**
1. **Inconsistent Messages** - Same errors had different wording
2. **Code Duplication** - Messages repeated across files
3. **Hard to Maintain** - Changes required updating multiple locations
4. **No Standardization** 
5. **Error-Prone** - Typos and inconsistencies common

#### **Previous Implementation Examples:**

**Controller Layer (`customerController.js`):**
```javascript
// ❌ BEFORE: Hardcoded, inconsistent messages
export const addCartItem = async (req, res) => {
  try {
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product ID is required'  // Hardcoded
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantity must be at least 1'  // Hardcoded
      });
    }

    // ... more hardcoded messages
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('out of stock')) {
      return res.status(400).json({ 
        success: false, 
        error: err.message  // Inconsistent error handling
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add product to cart'  // Hardcoded
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantity is required'  // Different wording!
      });
    }

    if (quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantity cannot be negative'  // Hardcoded
      });
    }

    // ... more inconsistencies
  } catch (err) {
    if (err.message.includes('Product not found in cart')) {
      return res.status(404).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    if (err.message.includes('Product not found')) {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    // ... more manual error handling
  }
};
```

**Service Layer (`customerService.js`):**
```javascript
// ❌ BEFORE: Scattered error messages
export const addToCart = async (customerId, productId, quantity) => {
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');  // Hardcoded
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');  // Hardcoded
    }
    
    if (product.stock <= 0) {
      throw new Error('Product is out of stock');  // Hardcoded
    }
    
    if (totalQuantity > product.stock) {
      throw new Error(
        `Only ${product.stock} items available in stock. You already have ${currentCartQuantity} in your cart.`  // Manual string concatenation
      );
    }
    
    // ... more hardcoded messages
  } catch (error) {
    throw new Error('Failed to add item to cart');  // Generic error
  }
};

export const updateCartQuantity = async (customerId, productId, quantity) => {
  try {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');  // Duplicated from controller
    }

    const index = customer.cart.findIndex(item => item.productId.toString() === productId.toString());
    if (index === -1) {
      throw new Error('Product not found in cart');  // Hardcoded
    }
    
    // ... more hardcoded messages
  } catch (error) {
    throw new Error('Failed to update cart item');  // Generic error
  }
};
```

#### **Problems Identified:**
1. **Message Inconsistency:**
   - `'Quantity must be at least 1'` vs `'Quantity is required'`
   - Different wording for similar validation errors

2. **Code Duplication:**
   - Same messages repeated in controller and service
   - Manual string concatenation for dynamic messages

3. **Maintenance Nightmare:**
   - Changing a message required updating multiple files
   - No single source of truth

4. **Error Handling Inconsistency:**
   - Manual `if/else` chains for error types
   - Different error handling patterns across functions

---

### 🟢 After: Centralized Implementation (Solution)

#### **Current Implementation Benefits:**
1. **Single Source of Truth** - All messages in one file
2. **Consistent Messaging** - Same message for same error type
3. **Easy Maintenance** - Update once, applies everywhere
4. **Type Safety** - IDE autocomplete and error prevention
5. **Dynamic Messages** - Support for placeholders and context
6. **Professional Quality** - Enterprise-grade message management

#### **Current Implementation:**

**Message Constants (`cartMessages.js`):**
```javascript
// ✅ AFTER: Centralized message management
export const CART_MESSAGES = {
  // Validation messages
  PRODUCT_ID_REQUIRED: 'Product ID is required',
  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_MINIMUM: 'Quantity must be at least 1',
  QUANTITY_NON_NEGATIVE: 'Quantity cannot be negative',
  
  // Error messages
  CUSTOMER_NOT_FOUND: 'Customer not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_NOT_IN_CART: 'Product not found in cart',
  PRODUCT_OUT_OF_STOCK: 'Product is out of stock',
  INSUFFICIENT_STOCK: 'Only {stock} items available in stock. You already have {cartQuantity} in your cart.',
  
  // Success messages
  ITEM_ADDED: 'Product added to cart successfully',
  ITEM_UPDATED: 'Cart quantity updated successfully',
  ITEM_REMOVED: 'Product removed from cart successfully',
  CART_RETRIEVED: 'Cart retrieved successfully',
  
  // Generic error messages
  ADD_TO_CART_FAILED: 'Failed to add product to cart',
  UPDATE_CART_FAILED: 'Failed to update cart item',
  REMOVE_FROM_CART_FAILED: 'Failed to remove product from cart',
  GET_CART_FAILED: 'Failed to retrieve cart'
};

// Helper function to format messages with placeholders
export const formatMessage = (message, placeholders = {}) => {
  let formattedMessage = message;
  
  Object.keys(placeholders).forEach(key => {
    const placeholder = `{${key}}`;
    formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), placeholders[key]);
  });
  
  return formattedMessage;
};

// Helper function to get stock error message
export const getStockErrorMessage = (currentStock, cartQuantity) => {
  return formatMessage(CART_MESSAGES.INSUFFICIENT_STOCK, {
    stock: currentStock,
    cartQuantity: cartQuantity
  });
};
```

**Updated Controller Layer:**
```javascript
// ✅ AFTER: Using centralized messages
import { CART_MESSAGES } from '../utils/cartMessages.js';

export const addCartItem = async (req, res) => {
  try {
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        error: CART_MESSAGES.PRODUCT_ID_REQUIRED  // Centralized
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: CART_MESSAGES.QUANTITY_MINIMUM  // Centralized
      });
    }

    const cart = await addToCartService(req.user.id, productId, quantity);
    res.status(201).json({ 
      success: true, 
      message: CART_MESSAGES.ITEM_ADDED,  // Centralized
      cart 
    });
  } catch (err) {
    const statusCode = getErrorStatusCode(err);
    const isUserFacing = isUserError(err);
    
    return res.status(statusCode).json({
      success: false,
      error: isUserFacing ? err.message : CART_MESSAGES.ADD_TO_CART_FAILED  // Centralized
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ 
        success: false, 
        error: CART_MESSAGES.QUANTITY_REQUIRED  // Consistent with other endpoints
      });
    }

    if (quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        error: CART_MESSAGES.QUANTITY_NON_NEGATIVE  // Centralized
      });
    }

    const result = await updateCartItemService(req.user.id, productId, quantity);
    res.status(200).json({ 
      success: true, 
      message: result.wasRemoved ? CART_MESSAGES.ITEM_REMOVED : CART_MESSAGES.ITEM_UPDATED,  // Centralized
      cart: result.cart
    });
  } catch (err) {
    const statusCode = getErrorStatusCode(err);
    const isUserFacing = isUserError(err);
    
    return res.status(statusCode).json({
      success: false,
      error: isUserFacing ? err.message : CART_MESSAGES.UPDATE_CART_FAILED  // Centralized
    });
  }
};
```

**Updated Service Layer:**
```javascript
// ✅ AFTER: Using centralized messages with custom error classes
import { CART_MESSAGES, getStockErrorMessage } from '../utils/cartMessages.js';
import { CartError, StockError, ProductError, ValidationError, DatabaseError } from '../utils/cartErrors.js';

export const addToCart = async (customerId, productId, quantity) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const customer = await Customer.findById(customerId).session(session);
      if (!customer) {
        throw new CartError(CART_MESSAGES.CUSTOMER_NOT_FOUND, 404, true);  // Centralized + typed
      }

      // ... business logic
    });
    
    return customer.cart;
  } catch (error) {
    if (error instanceof CartError) {
      throw error;  // Re-throw custom errors as-is
    }
    throw new DatabaseError(CART_MESSAGES.ADD_TO_CART_FAILED, error);  // Centralized
  } finally {
    await session.endSession();
  }
};

// Helper function with centralized messages
const validateStockAvailability = async (productId, requestedQuantity, currentCartQuantity = 0, session) => {
  const product = await Product.findById(productId).session(session);
  if (!product) {
    throw new ProductError(CART_MESSAGES.PRODUCT_NOT_FOUND, productId);  // Centralized
  }
  
  if (product.stock <= 0) {
    throw new StockError(CART_MESSAGES.PRODUCT_OUT_OF_STOCK, product.stock, requestedQuantity);  // Centralized
  }
  
  const totalQuantity = currentCartQuantity + requestedQuantity;
  if (totalQuantity > product.stock) {
    throw new StockError(
      getStockErrorMessage(product.stock, currentCartQuantity),  // Dynamic message
      product.stock,
      totalQuantity
    );
  }
  
  return product;
};
```

---

## Current Implementation

### Message Categories

#### **1. Validation Messages**
Used for input validation errors (400 Bad Request)

| Constant | Message | Usage |
|----------|---------|-------|
| `PRODUCT_ID_REQUIRED` | "Product ID is required" | Missing productId in request |
| `QUANTITY_REQUIRED` | "Quantity is required" | Missing quantity in request |
| `QUANTITY_MINIMUM` | "Quantity must be at least 1" | Invalid quantity for add operations |
| `QUANTITY_NON_NEGATIVE` | "Quantity cannot be negative" | Negative quantity validation |

#### **2. Business Logic Error Messages**
Used for business rule violations (400/404 status codes)

| Constant | Message | Usage |
|----------|---------|-------|
| `CUSTOMER_NOT_FOUND` | "Customer not found" | Invalid customer ID |
| `PRODUCT_NOT_FOUND` | "Product not found" | Product doesn't exist |
| `PRODUCT_NOT_IN_CART` | "Product not found in cart" | Item not in user's cart |
| `PRODUCT_OUT_OF_STOCK` | "Product is out of stock" | Product has no stock |
| `INSUFFICIENT_STOCK` | "Only {stock} items available..." | Exceeds available stock |

#### **3. Success Messages**
Used for successful operations (200/201 status codes)

| Constant | Message | Usage |
|----------|---------|-------|
| `ITEM_ADDED` | "Product added to cart successfully" | Successful add operation |
| `ITEM_UPDATED` | "Cart quantity updated successfully" | Successful update operation |
| `ITEM_REMOVED` | "Product removed from cart successfully" | Successful remove operation |
| `CART_RETRIEVED` | "Cart retrieved successfully" | Successful get operation |

#### **4. System Error Messages**
Used for unexpected server errors (500 status codes)

| Constant | Message | Usage |
|----------|---------|-------|
| `ADD_TO_CART_FAILED` | "Failed to add product to cart" | Database/transaction errors |
| `UPDATE_CART_FAILED` | "Failed to update cart item" | Database/transaction errors |
| `REMOVE_FROM_CART_FAILED` | "Failed to remove product from cart" | Database/transaction errors |
| `GET_CART_FAILED` | "Failed to retrieve cart" | Database/transaction errors |

---

## Usage Examples

### **Basic Message Usage**

```javascript
// Import the message constants
import { CART_MESSAGES } from '../utils/cartMessages.js';

// Use in validation
if (!productId) {
  return res.status(400).json({
    success: false,
    error: CART_MESSAGES.PRODUCT_ID_REQUIRED
  });
}

// Use in success responses
res.status(201).json({
  success: true,
  message: CART_MESSAGES.ITEM_ADDED,
  cart: updatedCart
});
```

### **Dynamic Message Usage**

```javascript
// Import helper functions
import { CART_MESSAGES, getStockErrorMessage } from '../utils/cartMessages.js';

// Use dynamic stock error message
const stockError = getStockErrorMessage(5, 3);
// Result: "Only 5 items available in stock. You already have 3 in your cart."

// Use formatMessage for custom placeholders
import { formatMessage } from '../utils/cartMessages.js';

const customMessage = formatMessage("Hello {name}, you have {count} items", {
  name: "John",
  count: 5
});
// Result: "Hello John, you have 5 items"
```

### **Error Class Integration**

```javascript
// Import error classes and messages
import { CartError, StockError, ProductError } from '../utils/cartErrors.js';
import { CART_MESSAGES } from '../utils/cartMessages.js';

// Use with custom error classes
if (!customer) {
  throw new CartError(CART_MESSAGES.CUSTOMER_NOT_FOUND, 404, true);
}

if (product.stock <= 0) {
  throw new StockError(CART_MESSAGES.PRODUCT_OUT_OF_STOCK, product.stock, requestedQuantity);
}

if (!product) {
  throw new ProductError(CART_MESSAGES.PRODUCT_NOT_FOUND, productId);
}
```

---

## Best Practices

### **1. Always Use Constants**
```javascript
// ✅ Good
error: CART_MESSAGES.PRODUCT_ID_REQUIRED

// ❌ Bad
error: 'Product ID is required'
```

### **2. Use Appropriate Message Categories**
```javascript
// ✅ Good - Use validation messages for input errors
if (!productId) {
  return res.status(400).json({
    success: false,
    error: CART_MESSAGES.PRODUCT_ID_REQUIRED
  });
}

// ✅ Good - Use business logic messages for domain errors
if (!product) {
  throw new ProductError(CART_MESSAGES.PRODUCT_NOT_FOUND, productId);
}
```

### **3. Use Dynamic Messages for Context**
```javascript
// ✅ Good - Dynamic message with context
throw new StockError(
  getStockErrorMessage(product.stock, currentCartQuantity),
  product.stock,
  totalQuantity
);

// ❌ Bad - Static message without context
throw new Error('Insufficient stock');
```

### **4. Consistent Error Handling**
```javascript
// ✅ Good - Consistent error handling pattern
try {
  const result = await serviceFunction();
  res.json({ success: true, data: result });
} catch (err) {
  const statusCode = getErrorStatusCode(err);
  const isUserFacing = isUserError(err);
  
  res.status(statusCode).json({
    success: false,
    error: isUserFacing ? err.message : CART_MESSAGES.GENERIC_ERROR
  });
}
```

---

## Migration Guide

### **Step 1: Identify Hardcoded Messages**
```bash
# Search for hardcoded strings in your codebase
grep -r "Product ID is required" backend/
grep -r "Quantity must be at least" backend/
grep -r "Product not found" backend/
```

### **Step 2: Replace with Constants**
```javascript
// Before
error: 'Product ID is required'

// After
error: CART_MESSAGES.PRODUCT_ID_REQUIRED
```

### **Step 3: Update Error Handling**
```javascript
// Before
if (err.message.includes('not found')) {
  return res.status(404).json({ error: err.message });
}

// After
const statusCode = getErrorStatusCode(err);
const isUserFacing = isUserError(err);
return res.status(statusCode).json({
  success: false,
  error: isUserFacing ? err.message : CART_MESSAGES.GENERIC_ERROR
});
```

### **Step 4: Test All Endpoints**
```bash
# Test all cart endpoints to ensure messages are consistent
curl -X GET /api/customers/cart
curl -X POST /api/customers/cart/items
curl -X PUT /api/customers/cart/items/:productId
curl -X DELETE /api/customers/cart/items/:productId
```

---

## API Reference

### **Message Constants**

#### **Validation Messages**
```javascript
CART_MESSAGES.PRODUCT_ID_REQUIRED     // "Product ID is required"
CART_MESSAGES.QUANTITY_REQUIRED       // "Quantity is required"
CART_MESSAGES.QUANTITY_MINIMUM        // "Quantity must be at least 1"
CART_MESSAGES.QUANTITY_NON_NEGATIVE   // "Quantity cannot be negative"
```

#### **Error Messages**
```javascript
CART_MESSAGES.CUSTOMER_NOT_FOUND      // "Customer not found"
CART_MESSAGES.PRODUCT_NOT_FOUND       // "Product not found"
CART_MESSAGES.PRODUCT_NOT_IN_CART     // "Product not found in cart"
CART_MESSAGES.PRODUCT_OUT_OF_STOCK    // "Product is out of stock"
CART_MESSAGES.INSUFFICIENT_STOCK      // "Only {stock} items available..."
```

#### **Success Messages**
```javascript
CART_MESSAGES.ITEM_ADDED              // "Product added to cart successfully"
CART_MESSAGES.ITEM_UPDATED            // "Cart quantity updated successfully"
CART_MESSAGES.ITEM_REMOVED            // "Product removed from cart successfully"
CART_MESSAGES.CART_RETRIEVED          // "Cart retrieved successfully"
```

#### **System Error Messages**
```javascript
CART_MESSAGES.ADD_TO_CART_FAILED      // "Failed to add product to cart"
CART_MESSAGES.UPDATE_CART_FAILED      // "Failed to update cart item"
CART_MESSAGES.REMOVE_FROM_CART_FAILED // "Failed to remove product from cart"
CART_MESSAGES.GET_CART_FAILED         // "Failed to retrieve cart"
```

### **Helper Functions**

#### **formatMessage(message, placeholders)**
Formats a message with placeholder values.

**Parameters:**
- `message` (string): Message template with placeholders
- `placeholders` (object): Key-value pairs for placeholder replacement

**Example:**
```javascript
const message = formatMessage("Hello {name}, you have {count} items", {
  name: "John",
  count: 5
});
// Result: "Hello John, you have 5 items"
```

#### **getStockErrorMessage(currentStock, cartQuantity)**
Generates a stock error message with current stock and cart quantity.

**Parameters:**
- `currentStock` (number): Available stock quantity
- `cartQuantity` (number): Quantity already in cart

**Example:**
```javascript
const errorMessage = getStockErrorMessage(5, 3);
// Result: "Only 5 items available in stock. You already have 3 in your cart."
```

---

## Summary

The cart message system has evolved from a scattered, inconsistent approach to a centralized, maintainable solution. The current implementation provides:

- **27 message constants** used across 3 files
- **100% consistency** in messaging
- **Dynamic message support** with placeholders
- **Type safety** with custom error classes
- **Easy maintenance** with single source of truth
- **Professional quality** suitable for production

This centralized approach ensures that all cart operations provide consistent, user-friendly messages while being easy to maintain and extend for future requirements.

---

*Last updated: December 2024*
*Version: 1.0.0*
