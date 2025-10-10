import React, { useState, useEffect } from 'react';
import {
  View,
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
} from 'react-native-paper';
import { StorageService } from '../utils/storage';
import { theme, spacing } from '../styles/theme';
import { Camera , CameraView } from 'expo-camera';



const { width, height } = Dimensions.get('window');

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [productDialogVisible, setProductDialogVisible] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState('');

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setScanning(false);
    setLastScannedBarcode(data);

    try {
      // Check if product exists with this barcode
      const existingProduct = await StorageService.getProductByBarcode(data);
      
      if (existingProduct) {
        setFoundProduct(existingProduct);
        setProductDialogVisible(true);
      } else {
        // No existing product, offer to create new one
        Alert.alert(
          'Barcode Scanned',
          `Barcode: ${data}\n\nNo product found with this barcode. Would you like to add a new product?`,
          [
            { text: 'Scan Again', onPress: resetScanner },
            {
              text: 'Add Product',
              onPress: () => {
                navigation.navigate('AddEditProduct', { scannedBarcode: data });
                resetScanner();
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to lookup product');
      resetScanner();
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanning(true);
    setFoundProduct(null);
    setProductDialogVisible(false);
    setLastScannedBarcode('');
  };

  const handleViewProduct = () => {
    setProductDialogVisible(false);
    navigation.navigate('ProductDetail', { product: foundProduct });
    resetScanner();
  };

  const handleEditProduct = () => {
    setProductDialogVisible(false);
    navigation.navigate('AddEditProduct', { product: foundProduct });
    resetScanner();
  };

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
              This app needs camera access to scan barcodes. Please grant camera permission in your device settings.
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scanning && (
        <CameraView
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
        />
      )}
      
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.instructionText}>
            Point your camera at a barcode
          </Text>
        </View>
        
        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
        </View>
        
        <View style={styles.bottomOverlay}>
          {lastScannedBarcode && (
            <Text style={styles.lastScannedText}>
              Last scanned: {lastScannedBarcode}
            </Text>
          )}
          
          <Button
            mode="contained"
            onPress={resetScanner}
            style={styles.resetButton}
            disabled={scanning && !scanned}
          >
            {scanned ? 'Scan Again' : 'Reset Scanner'}
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog
          visible={productDialogVisible}
          onDismiss={() => setProductDialogVisible(false)}
        >
          <Dialog.Title>Product Found!</Dialog.Title>
          <Dialog.Content>
            {foundProduct && (
              <View>
                <Text style={styles.productName}>{foundProduct.name}</Text>
                <View style={styles.productChips}>
                  <Chip mode="outlined" style={styles.chip}>
                    ${foundProduct.price.toFixed(2)}
                  </Chip>
                  <Chip 
                    mode="outlined" 
                    style={[styles.chip, foundProduct.quantity === 0 && styles.outOfStockChip]}
                  >
                    Qty: {foundProduct.quantity}
                  </Chip>
                </View>
                {foundProduct.description && (
                  <Text variant='bodyMedium' style={styles.productDescription}>
                    {foundProduct.description}
                  </Text>
                )}
                <Text style={styles.barcodeText}>
                  Barcode: {foundProduct.barcode}
                </Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setProductDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleEditProduct}>
              Edit
            </Button>
            <Button onPress={handleViewProduct}>
              View Details
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
    backgroundColor: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: spacing.lg,
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scanArea: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: 150,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  lastScannedText: {
    color: 'white',
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: theme.colors.primary,
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
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  productChips: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.primary + '20',
  },
  outOfStockChip: {
    backgroundColor: theme.colors.error + '20',
    borderColor: theme.colors.error,
  },
  productDescription: {
    marginBottom: spacing.sm,
  },
  barcodeText: {
    fontSize: 12,
    color: theme.colors.placeholder,
    fontFamily: 'monospace',
  },
});