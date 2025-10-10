import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Searchbar,
  FAB,
  Card,
  Title,
  Paragraph,
  Chip,
  Menu,
  Divider,
  Portal,
  Dialog,
  Button,
  Text,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';
import { sampleProducts, generateSampleDataExport } from '../utils/sampleData';
import { theme, spacing } from '../styles/theme';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportData, setExportData] = useState('');

  const loadProducts = async () => {
    try {
      const loadedProducts = await StorageService.getAllProducts();
      setProducts(loadedProducts);
      setFilteredProducts(loadedProducts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.barcode.includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.deleteProduct(productId);
            if (success) {
              loadProducts();
            } else {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const data = await StorageService.exportData();
      if (data) {
        setExportData(data);
        setExportDialogVisible(true);
      } else {
        Alert.alert('Error', 'Failed to export data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all products? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.clearAllData();
            if (success) {
              loadProducts();
            } else {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleLoadSampleData = () => {
    Alert.alert(
      'Load Sample Data',
      'This will add sample products to your inventory. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load Sample Data',
          onPress: async () => {
            try {
              for (const product of sampleProducts) {
                await StorageService.saveProduct(product);
              }
              loadProducts();
              Alert.alert('Success', 'Sample data loaded successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to load sample data');
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <Card
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph numberOfLines={2}>{item.description || 'No description'}</Paragraph>
        <View style={styles.productInfo}>
          <Chip mode="outlined" style={styles.chip}>
            ${item.price.toFixed(2)}
          </Chip>
          <Chip mode="outlined" style={styles.chip}>
            Qty: {item.quantity}
          </Chip>
          {item.category && (
            <Chip mode="outlined" style={styles.chip}>
              {item.category}
            </Chip>
          )}
        </View>
        {item.barcode && (
          <Paragraph style={styles.barcode}>Barcode: {item.barcode}</Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.menuButton}
            >
              Menu
            </Button>
          }
        >
          <Menu.Item onPress={handleExportData} title="Export Data" />
          <Menu.Item onPress={() => navigation.navigate('ImportData')} title="Import Data" />
          <Divider />
          <Menu.Item onPress={handleLoadSampleData} title="Load Sample Data" />
          <Divider />
          <Menu.Item onPress={handleClearData} title="Clear All Data" />
        </Menu>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No products found' : 'No products in inventory'}
            </Text>
            <Text style={styles.emptySubText}>
              {searchQuery ? 'Try a different search term' : 'Tap the + button to add your first product or use the menu to load sample data'}
            </Text>
            {!searchQuery && (
              <Button
                mode="outlined"
                onPress={handleLoadSampleData}
                style={styles.sampleDataButton}
              >
                Load Sample Data
              </Button>
            )}
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditProduct')}
      />

      <Portal>
        <Dialog
          visible={exportDialogVisible}
          onDismiss={() => setExportDialogVisible(false)}
        >
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Content>
            <Text>Copy the data below to backup your inventory:</Text>
            <Text style={styles.exportText} selectable>
              {exportData}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setExportDialogVisible(false)}>Close</Button>
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
  },
  header: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
  },
  menuButton: {
    minWidth: 80,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  productCard: {
    marginBottom: spacing.md,
  },
  productInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  chip: {
    marginRight: spacing.xs,
  },
  barcode: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  sampleDataButton: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  exportText: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    fontSize: 10,
    maxHeight: 200,
  },
});