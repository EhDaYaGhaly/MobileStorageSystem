import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  Divider,
} from 'react-native-paper';
import { Product } from '../models/Product';
import { StorageService } from '../utils/storage';
import { ValidationUtils } from '../utils/validation';
import { theme, spacing } from '../styles/theme';

export default function AddEditProductScreen({ route, navigation }) {
  const { product, scannedBarcode } = route.params || {};
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price?.toString() || '',
    quantity: product?.quantity?.toString() || '',
    barcode: product?.barcode || scannedBarcode || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scannedBarcode && !isEditing) {
      // Check if product with this barcode already exists
      checkExistingBarcode(scannedBarcode);
    }
  }, [scannedBarcode, isEditing]);

  const checkExistingBarcode = async (barcode) => {
    try {
      const existingProduct = await StorageService.getProductByBarcode(barcode);
      if (existingProduct) {
        Alert.alert(
          'Product Exists',
          `A product with this barcode already exists: "${existingProduct.name}". Do you want to edit it instead?`,
          [
            { text: 'Create New', style: 'cancel' },
            {
              text: 'Edit Existing',
              onPress: () => {
                navigation.replace('AddEditProduct', { product: existingProduct });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error checking existing barcode:', error);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const productData = {
      name: formData.name,
      price: formData.price,
      quantity: formData.quantity,
      barcode: formData.barcode,
    };

    const validation = ValidationUtils.validateProduct(productData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      let productToSave;
      
      if (isEditing) {
        // Update existing product
        productToSave = new Product(
          product.id,
          formData.name.trim(),
          formData.barcode.trim(),
          parseFloat(formData.price),
          parseInt(formData.quantity),
          formData.description.trim(),
          formData.category.trim()
        );
        productToSave.createdAt = product.createdAt; // Preserve original creation date
      } else {
        // Create new product
        productToSave = new Product(
          null,
          formData.name.trim(),
          formData.barcode.trim(),
          parseFloat(formData.price),
          parseInt(formData.quantity),
          formData.description.trim(),
          formData.category.trim()
        );
      }

      const success = await StorageService.saveProduct(productToSave);
      
      if (success) {
        Alert.alert(
          'Success',
          `Product ${isEditing ? 'updated' : 'added'} successfully`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'add'} product`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </Title>

            <TextInput
              label="Product Name *"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <TextInput
              label="Category"
              value={formData.category}
              onChangeText={(text) => updateField('category', text)}
              mode="outlined"
              style={styles.input}
            />

            <Divider style={styles.divider} />

            <TextInput
              label="Price *"
              value={formData.price}
              onChangeText={(text) => updateField('price', text)}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              error={!!errors.price}
              left={<TextInput.Affix text="$" />}
            />
            <HelperText type="error" visible={!!errors.price}>
              {errors.price}
            </HelperText>

            <TextInput
              label="Quantity *"
              value={formData.quantity}
              onChangeText={(text) => updateField('quantity', text)}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.input}
              error={!!errors.quantity}
            />
            <HelperText type="error" visible={!!errors.quantity}>
              {errors.quantity}
            </HelperText>

            <Divider style={styles.divider} />

            <TextInput
              label="Barcode"
              value={formData.barcode}
              onChangeText={(text) => updateField('barcode', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.barcode}
              placeholder="Scan or enter manually"
            />
            <HelperText type="error" visible={!!errors.barcode}>
              {errors.barcode}
            </HelperText>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>

          <Button
            mode="outlined"
            onPress={handleCancel}
            disabled={loading}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.xs,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  buttonContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    borderColor: theme.colors.placeholder,
  },
});