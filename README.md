# Mobile Storage Management System

A complete mobile storage management application with barcode scanning capabilities built with React Native and Expo.

## Features

### 🏪 **Product Inventory Management**
- View all products in inventory with quantities and prices
- Add new products to inventory
- Update existing product information
- Remove products from inventory
- Search and filter products by name, description, category, or barcode
- Track product categories and descriptions

### 📱 **Barcode Scanner Integration**
- Scan barcodes to quickly find existing products
- Scan barcodes to add new products with pre-filled barcode data
- Support for common barcode formats (UPC, EAN, Code128, etc.)
- Real-time barcode scanning with camera preview
- Automatic product lookup by barcode

### 💰 **Cashier & Point of Sale**
- Scan products to add them to shopping cart
- Manual barcode entry for damaged or unreadable barcodes
- Adjust item quantities directly in cart
- Real-time cart total calculation
- Stock availability checking before adding to cart
- Checkout with automatic inventory deduction
- Clear cart functionality with confirmation
- Out of stock and insufficient stock alerts

### 🎨 **User Interface Features**
- Clean, intuitive mobile-first design
- Product list view with search capabilities
- Detailed product view with full information
- Easy-to-use add/edit product forms
- Professional scanner interface with visual feedback
- Responsive layout optimized for mobile devices

### 💾 **Data Management**
- Local storage using AsyncStorage for offline functionality
- Data persistence between app sessions
- Export inventory data as JSON for backup
- Import functionality to restore data
- Real-time data synchronization across screens

### 🔒 **Quality & Reliability**
- Comprehensive form validation and error handling
- Loading states and user feedback
- Professional error messages and confirmations
- Optimized performance for smooth user experience

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6.x
- **UI Components**: React Native Paper (Material Design)
- **Barcode Scanning**: expo-barcode-scanner
- **Storage**: AsyncStorage for local data persistence
- **State Management**: React Hooks (useState, useEffect)
- **Validation**: Custom validation utilities
- **Styling**: StyleSheet with consistent theming

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EhDaYaGhaly/mobile-storage-system.git
   cd mobile-storage-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI** (if not already installed)
   ```bash
   npm install -g expo-cli
   ```

## Running the Application

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Run on device/simulator**
   - **iOS**: `npm run ios` (requires Xcode)
   - **Android**: `npm run android` (requires Android Studio)
   - **Web**: `npm run web`

3. **Using Expo Go App**
   - Install Expo Go on your mobile device
   - Scan the QR code displayed in the terminal
   - The app will load directly on your device

## Usage Guide

### Adding Products
1. Tap the "+" button on the inventory screen
2. Fill in product details (name and price are required)
3. Optionally scan or enter a barcode
4. Save the product

### Scanning Barcodes
1. Navigate to the "Scanner" tab
2. Point camera at a barcode
3. If product exists, view or edit details
4. If new barcode, create a new product

### Managing Inventory
- **View Products**: Browse the inventory list with search
- **Edit Products**: Tap on any product to view details, then edit
- **Delete Products**: Use the delete button in product details
- **Export Data**: Use the menu in inventory screen to export data

### Data Management
- **Export**: Menu → Export Data → Copy JSON backup
- **Clear**: Menu → Clear All Data (with confirmation)
- **Import**: Paste JSON data in import function

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.js
│   └── ProductItem.js
├── screens/            # Application screens
│   ├── ProductListScreen.js
│   ├── ProductDetailScreen.js
│   ├── AddEditProductScreen.js
│   ├── CashierScreen.js
│   └── ScannerScreen.js
├── stacks/            # Application stacks
│   ├── ProductStack.js
│   ├── CashierStack.js
│   └── Stack.js
├── models/             # Data models
│   └── Product.js
├── utils/              # Utility functions
│   ├── storage.js      # AsyncStorage operations
│   └── validation.js   # Form validation
├── styles/             # Styling and themes
│   └── theme.js
└── navigation/         # Navigation configuration
    └── AppNavigator.js
```

## Development

### Code Quality
```bash
# Lint code
npm run lint

# Run tests
npm run test
```

### Building for Production
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Build for Web
npm run web
```

## Permissions

The app requires the following permissions:
- **Camera**: For barcode scanning functionality
- **Storage**: For local data persistence

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Roadmap

- [ ] Cloud synchronization
- [ ] Multi-user support
- [ ] Advanced reporting and analytics
- [ ] Batch barcode scanning
- [ ] Print labels functionality
- [ ] REST API integration
- [ ] Inventory alerts and notifications

---

Built with ❤️ using React Native and Expo