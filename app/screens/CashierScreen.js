import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Portal,
  Dialog,
  Chip,
  Divider,
  IconButton,
  Surface,
  TextInput,
} from 'react-native-paper';
import { StorageService } from '../utils/storage';
import { theme, spacing } from '../styles/theme';
import { Camera, CameraView } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function CashierScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [cart, setCart] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [checkoutDialogVisible, setCheckoutDialogVisible] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processing, setProcessing] = useState(false);


  const [manualEntryVisible, setManualEntryVisible] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');


  const processingRef = useRef(false);
  const lastScanTimeRef = useRef(0);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  
  const processBarcode = async (barcode) => {
    const currentTime = Date.now();

    
    if (
      processingRef.current ||
      scanned ||
      (lastScanTimeRef.current && currentTime - lastScanTimeRef.current < 1500)
    ) {
      return;
    }

  
    processingRef.current = true;
    setProcessing(true);
    setScanned(true);
    lastScanTimeRef.current = currentTime;

    try {
      const product = await StorageService.getProductByBarcode(barcode);

      if (product) {
        if (product.quantity <= 0) {
          Alert.alert(
            'Out of Stock',
            `${product.name} is currently out of stock.`,
            [{ text: 'OK', onPress: resetScanner }],
            { cancelable: false }
          );
          return;
        }

 
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
       
          const updatedCart = [...cart];
          const currentCartQuantity = updatedCart[existingItemIndex].quantity;

          if (currentCartQuantity >= product.quantity) {
            Alert.alert(
              'Insufficient Stock',
              `Only ${product.quantity} items available for ${product.name}.`,
              [{ text: 'OK', onPress: resetScanner }],
              { cancelable: false }
            );
            return;
          }

          updatedCart[existingItemIndex].quantity += 1;
          setCart(updatedCart);
        } else {
      
          setCart(prev => [...prev, {
            id: product.id,
            name: product.name,
            price: product.price,
            barcode: product.barcode,
            quantity: 1,
            availableStock: product.quantity,
          }]);
        }

        resetScanner();
      } else {
        Alert.alert(
          'Product Not Found',
          `No product found with barcode: ${barcode}`,
          [{ text: 'OK', onPress: resetScanner }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error looking up product:', error);
      Alert.alert(
        'Error',
        'Failed to lookup product',
        [{ text: 'OK', onPress: resetScanner }],
        { cancelable: false }
      );
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    await processBarcode(data);
  };


  const handleManualEntry = async () => {
    if (!manualBarcode.trim()) {
      Alert.alert('Input Error', 'Please enter a barcode.');
      return;
    }
    setManualEntryVisible(false);
    setManualBarcode('');
    await processBarcode(manualBarcode.trim());
  };

  const resetScanner = () => {
    setScanned(false);
    setProcessing(false);
    processingRef.current = false;
    setManualBarcode('');

    setTimeout(() => {
      lastScanTimeRef.current = 0;
    }, 500);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const item = cart.find(item => item.id === itemId);
    if (item && newQuantity > item.availableStock) {
      Alert.alert(
        'Insufficient Stock',
        `Only ${item.availableStock} items available for ${item.name}.`
      );
      return;
    }

    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please scan some items before checkout.');
      return;
    }
    setCheckoutDialogVisible(true);
  };

  const processPayment = async () => {
    setProcessingPayment(true);

    try {
      for (const cartItem of cart) {
        const product = await StorageService.getProductById(cartItem.id);
        if (product) {
          const newQuantity = product.quantity - cartItem.quantity;
          const updatedProduct = { ...product, quantity: newQuantity };
          await StorageService.saveProduct(updatedProduct);
        }
      }
      setCart([]);
      setCheckoutDialogVisible(false);

      Alert.alert(
        'Payment Successful',
        `Transaction completed successfully!\nTotal: $${calculateTotal().toFixed(2)}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from the cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setCart([]) }
      ]
    );
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
    if (!showScanner) {
      resetScanner();
    }
  };

  const renderCartItem = ({ item }) => (
    <Card style={styles.cartItem}>
      <Card.Content>
        <View style={styles.cartItemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <IconButton
            icon="close"
            size={20}
            onPress={() => removeFromCart(item.id)}
          />
        </View>

        <View style={styles.cartItemDetails}>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
          <Text style={styles.itemStock}>Stock: {item.availableStock}</Text>
        </View>

        <View style={styles.quantityControls}>
          <IconButton
            icon="minus"
            size={20}
            onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          />
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <IconButton
            icon="plus"
            size={20}
            onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.availableStock}
          />
          <Text style={styles.itemTotal}>
            = ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Card style={styles.permissionCard}>
          <Card.Content>
            <Text style={styles.permissionTitle}>Camera Permission Required</Text>
            <Text variant="bodyMedium" style={styles.permissionText}>
              Camera access is needed to scan product barcodes.
            </Text>
            <Button
              mode="contained"
              onPress={() => Camera.requestCameraPermissionsAsync()}
              style={styles.permissionButton}
            >
              Grant Permission
            </Button>
          </Card.Content>
        </Card>
        <Button
          style={{ marginTop: spacing.lg }}
          mode="outlined"
          onPress={() => setManualEntryVisible(true)}
        >
          Enter Barcode Manually
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showScanner && (
        <View style={styles.scannerContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
             selectedLens='Back Ultra Wide Camera'
            barcodeScannerSettings={{
              barcodeTypes: ['code128', 'ean13', 'ean8', 'upc_a', 'upc_e'],
            }}
            facing="back"
          />

          <View style={styles.scannerOverlay}>
            <View style={[styles.scanFrame, processing && styles.processingFrame]} />
            <Text style={styles.scannerText}>
              {processing ? 'Processing...' : 'Scan product barcode'}
            </Text>
            <Button
              style={{ marginTop: spacing.md }}
              mode="outlined"
              onPress={() => setManualEntryVisible(true)}
            >
              Enter Barcode Manually
            </Button>
          </View>
        </View>
      )}

      <View style={styles.cartContainer}>
        <Surface style={styles.cartHeader}>
          <View style={styles.cartHeaderContent}>
            <Text style={styles.cartTitle}>
              Cart ({getTotalItems()} items)
            </Text>
            <View style={styles.cartHeaderButtons}>
              <Button
                mode="outlined"
                onPress={toggleScanner}
                compact
                style={styles.toggleButton}
              >
                {showScanner ? 'Hide Scanner' : 'Show Scanner'}
              </Button>
              {cart.length > 0 && (
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={clearCart}
                />
              )}
            </View>
          </View>

          {cart.length > 0 && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total: ${calculateTotal().toFixed(2)}
              </Text>
            </View>
          )}
        </Surface>

        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          style={styles.cartList}
          ListEmptyComponent={
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartText}>
                Cart is empty
              </Text>
              <Text style={styles.emptyCartSubText}>
                Scan product barcodes to add items
              </Text>
            </View>
          }
        />

        {cart.length > 0 && (
          <View style={styles.checkoutContainer}>
            <Button
              mode="contained"
              onPress={handleCheckout}
              style={styles.checkoutButton}
              contentStyle={styles.checkoutButtonContent}
            >
              Checkout - ${calculateTotal().toFixed(2)}
            </Button>
          </View>
        )}
      </View>

      <Portal>
        {/* Checkout Dialog */}
        <Dialog
          visible={checkoutDialogVisible}
          onDismiss={() => setCheckoutDialogVisible(false)}
        >
          <Dialog.Title>Checkout</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.checkoutSummary}>
              Items: {getTotalItems()}
            </Text>
            <Text style={styles.checkoutTotal}>
              Total: ${calculateTotal().toFixed(2)}
            </Text>
            <Divider style={styles.checkoutDivider} />
            <Text variant="bodyMedium">
              Confirm payment and update inventory?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setCheckoutDialogVisible(false)}
              disabled={processingPayment}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={processPayment}
              loading={processingPayment}
              disabled={processingPayment}
            >
              Confirm Payment
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Manual Barcode Entry Dialog */}
        <Dialog
          visible={manualEntryVisible}
          onDismiss={() => setManualEntryVisible(false)}
        >
          <Dialog.Title>Enter Barcode Manually</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Barcode Number"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="number-pad"
              autoFocus
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setManualEntryVisible(false)}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleManualEntry}
            >
              Add to Cart
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: spacing.lg,
  },
  scannerContainer: {
    height: height * 0.4,
    backgroundColor: 'black',
  },
  scanner: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: 100,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  processingFrame: {
    borderColor: '#FFA500',
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartContainer: {
    flex: 1,
  },
  cartHeader: {
    elevation: 4,
  },
  cartHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    marginRight: spacing.xs,
  },
  totalContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'right',
  },
  cartList: {
    flex: 1,
    padding: spacing.md,
  },
  cartItem: {
    marginBottom: spacing.sm,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cartItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  itemPrice: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  itemStock: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: spacing.sm,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: 'auto',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  emptyCartSubText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
  checkoutContainer: {
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
  },
  checkoutButtonContent: {
    height: 50,
  },
  permissionCard: {
    width: '100%',
    maxWidth: 400,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
  },
  checkoutSummary: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  checkoutTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: spacing.sm,
  },
  checkoutDivider: {
    marginVertical: spacing.md,
  },
});