import { createStackNavigator } from '@react-navigation/stack';
import ScannerScreen from '../screens/ScannerScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
const Stack = createStackNavigator();
export function ScannerStack() {
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
        name="Scanner" 
        component={ScannerScreen}
        options={{ title: 'Barcode Scanner' }}
      />
      <Stack.Screen 
        name="AddEditProduct" 
        component={AddEditProductScreen}
        options={({ route }) => ({
          title: route.params?.product ? 'Edit Product' : 'Add Product'
        })}
      />
    </Stack.Navigator>
  );
}
