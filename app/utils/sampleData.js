import { Product } from '../models/Product';

/**
 * Sample data for demonstration and testing
 */
export const sampleProducts = [
  new Product(
    'sample-1',
    'Apple iPhone 15',
    '194253714125',
    999.99,
    5,
    'Latest iPhone with advanced camera system and A17 Pro chip',
    'Electronics'
  ),
  new Product(
    'sample-2',
    'Samsung Galaxy S24',
    '8806095198989',
    899.99,
    3,
    'Flagship Android smartphone with AI features',
    'Electronics'
  ),
  new Product(
    'sample-3',
    'Office Chair',
    '123456789012',
    299.99,
    10,
    'Ergonomic office chair with lumbar support',
    'Furniture'
  ),
  new Product(
    'sample-4',
    'Bluetooth Headphones',
    '789123456789',
    199.99,
    0,
    'Wireless noise-canceling headphones',
    'Electronics'
  ),
  new Product(
    'sample-5',
    'Coffee Beans',
    '456789123456',
    24.99,
    25,
    'Premium Arabica coffee beans, medium roast',
    'Food & Beverage'
  ),
];

/**
 * Generate sample data in export format
 */
export const generateSampleDataExport = () => {
  return JSON.stringify({
    products: sampleProducts.map(p => p.toJson()),
    exportDate: new Date().toISOString(),
    version: '1.0'
  }, null, 2);
};