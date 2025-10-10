import { createStackNavigator } from '@react-navigation/stack';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
import ImportDataScreen from '../screens/ImportDataScreen';
export function ProductStack() {
const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Inventory' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen 
        name="AddEditProduct" 
        component={AddEditProductScreen}
        options={({ route }) => ({
          title: route.params?.product ? 'Edit Product' : 'Add Product'
        })}
      />
      <Stack.Screen 
        name="ImportData" 
        component={ImportDataScreen}
        options={{ title: 'Import Data' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Scanner
