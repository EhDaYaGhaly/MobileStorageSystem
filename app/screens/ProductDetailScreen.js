import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  Text,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../utils/storage';
import { theme, spacing } from '../styles/theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;

  const handleEdit = () => {
    navigation.navigate('AddEditProduct', { product });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.deleteProduct(product.id);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{product.name}</Title>
          
          <View style={styles.priceQuantityRow}>
            <Chip mode="outlined" style={styles.priceChip}>
              <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
            </Chip>
            <Chip 
              mode="outlined" 
              style={[styles.quantityChip, product.quantity === 0 && styles.outOfStockChip]}
            >
              <Text style={[styles.quantityText, product.quantity === 0 && styles.outOfStockText]}>
                Qty: {product.quantity}
              </Text>
            </Chip>
          </View>

          {product.quantity === 0 && (
            <Chip 
              mode="flat" 
              style={styles.outOfStockBadge}
              textStyle={styles.outOfStockBadgeText}
            >
              OUT OF STOCK
            </Chip>
          )}

          <Divider style={styles.divider} />

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Paragraph style={styles.description}>{product.description}</Paragraph>
            </View>
          )}

          {product.category && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <Chip mode="outlined" style={styles.categoryChip}>
                {product.category}
              </Chip>
            </View>
          )}

          {product.barcode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Barcode</Text>
              <View style={styles.barcodeContainer}>
                <Ionicons name="barcode-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.barcodeText}>{product.barcode}</Text>
              </View>
            </View>
          )}

          <Divider style={styles.divider} />

          <View style={styles.metadataSection}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Product ID:</Text>
              <Text style={styles.metadataValue}>{product.id}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Created:</Text>
              <Text style={styles.metadataValue}>{formatDate(product.createdAt)}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Last Updated:</Text>
              <Text style={styles.metadataValue}>{formatDate(product.updatedAt)}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleEdit}
          style={styles.editButton}
          icon="pencil"
        >
          Edit Product
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.deleteButton}
          textColor={theme.colors.error}
          icon="delete"
        >
          Delete Product
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  priceQuantityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  priceChip: {
    backgroundColor: theme.colors.success + '20',
    borderColor: theme.colors.success,
  },
  priceText: {
    color: theme.colors.success,
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityChip: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  quantityText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  outOfStockChip: {
    backgroundColor: theme.colors.error + '20',
    borderColor: theme.colors.error,
  },
  outOfStockText: {
    color: theme.colors.error,
  },
  outOfStockBadge: {
    backgroundColor: theme.colors.error,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  outOfStockBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: theme.colors.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barcodeText: {
    fontSize: 16,
    fontFamily: 'monospace',
    backgroundColor: theme.colors.background,
    padding: spacing.sm,
    borderRadius: 4,
    flex: 1,
  },
  metadataSection: {
    marginTop: spacing.sm,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  metadataLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
    fontWeight: '500',
  },
  metadataValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});