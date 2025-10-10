import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../models/Product';

const STORAGE_KEY = '@mobile_storage_products';

/**
 * Storage utility for managing product data
 */
export class StorageService {
  static async getAllProducts() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) {
        const productsData = JSON.parse(jsonValue);
        return productsData.map(data => Product.fromJson(data));
      }
      return [];
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  static async saveProduct(product) {
    try {
      const products = await this.getAllProducts();
      const existingIndex = products.findIndex(p => p.id === product.id);
      
      if (existingIndex >= 0) {
        products[existingIndex] = product;
      } else {
        products.push(product);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products.map(p => p.toJson())));
      return true;
    } catch (error) {
      console.error('Error saving product:', error);
      return false;
    }
  }

  static async deleteProduct(productId) {
    try {
      const products = await this.getAllProducts();
      const filteredProducts = products.filter(p => p.id !== productId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts.map(p => p.toJson())));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  static async getProductByBarcode(barcode) {
    try {
      const products = await this.getAllProducts();
      return products.find(p => p.barcode === barcode) || null;
    } catch (error) {
      console.error('Error finding product by barcode:', error);
      return null;
    }
  }

  static async searchProducts(query) {
    try {
      const products = await this.getAllProducts();
      const lowercaseQuery = query.toLowerCase();
      return products.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.barcode.includes(query)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  static async exportData() {
    try {
      const products = await this.getAllProducts();
      return JSON.stringify({
        products: products.map(p => p.toJson()),
        exportDate: new Date().toISOString(),
        version: '1.0'
      }, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  static async importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data.products && Array.isArray(data.products)) {
        const products = data.products.map(productData => Product.fromJson(productData));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products.map(p => p.toJson())));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static async clearAllData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}