/**
 * Validation utilities for form inputs
 */
export const ValidationUtils = {
  validateProductName: (name) => {
    if (!name || name.trim().length === 0) {
      return 'Product name is required';
    }
    if (name.trim().length < 2) {
      return 'Product name must be at least 2 characters';
    }
    if (name.trim().length > 100) {
      return 'Product name must be less than 100 characters';
    }
    return null;
  },

  validatePrice: (price) => {
    if (price === '' || price === null || price === undefined) {
      return 'Price is required';
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      return 'Price must be a valid number';
    }
    if (numPrice < 0) {
      return 'Price cannot be negative';
    }
    if (numPrice > 999999.99) {
      return 'Price is too high';
    }
    return null;
  },

  validateQuantity: (quantity) => {
    if (quantity === '' || quantity === null || quantity === undefined) {
      return 'Quantity is required';
    }
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity)) {
      return 'Quantity must be a valid number';
    }
    if (numQuantity < 0) {
      return 'Quantity cannot be negative';
    }
    if (numQuantity > 999999) {
      return 'Quantity is too high';
    }
    return null;
  },

  validateBarcode: (barcode) => {
    if (!barcode || barcode.trim().length === 0) {
      return null; // Barcode is optional
    }
    if (barcode.trim().length < 6) {
      return 'Barcode must be at least 6 characters';
    }
    if (barcode.trim().length > 50) {
      return 'Barcode must be less than 50 characters';
    }
    // Check if barcode contains only alphanumeric characters
    if (!/^[a-zA-Z0-9]+$/.test(barcode.trim())) {
      return 'Barcode must contain only letters and numbers';
    }
    return null;
  },

  validateProduct: (product) => {
    const errors = {};
    
    const nameError = ValidationUtils.validateProductName(product.name);
    if (nameError) errors.name = nameError;

    const priceError = ValidationUtils.validatePrice(product.price);
    if (priceError) errors.price = priceError;

    const quantityError = ValidationUtils.validateQuantity(product.quantity);
    if (quantityError) errors.quantity = quantityError;

    const barcodeError = ValidationUtils.validateBarcode(product.barcode);
    if (barcodeError) errors.barcode = barcodeError;

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  formatPrice: (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '0.00';
    return numPrice.toFixed(2);
  },

  formatQuantity: (quantity) => {
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity)) return '0';
    return numQuantity.toString();
  }
};