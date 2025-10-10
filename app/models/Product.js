/**
 * Product data model
 */
export class Product {
  constructor(id, name, barcode, price, quantity, description = '', category = '') {
    this.id = id || this.generateId();
    this.name = name;
    this.barcode = barcode;
    this.price = parseFloat(price) || 0;
    this.quantity = parseInt(quantity) || 0;
    this.description = description;
    this.category = category;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static fromJson(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new Product(
      data.id,
      data.name,
      data.barcode,
      data.price,
      data.quantity,
      data.description,
      data.category
    );
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      barcode: this.barcode,
      price: this.price,
      quantity: this.quantity,
      description: this.description,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  updateQuantity(newQuantity) {
    this.quantity = parseInt(newQuantity) || 0;
    this.updatedAt = new Date().toISOString();
  }

  updatePrice(newPrice) {
    this.price = parseFloat(newPrice) || 0;
    this.updatedAt = new Date().toISOString();
  }

  isValid() {
    return this.name && this.name.trim().length > 0 && this.price >= 0 && this.quantity >= 0;
  }
}