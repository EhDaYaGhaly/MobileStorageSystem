import CashierScreen from '../screens/CashierScreen';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export function CashierStack() {
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
        name="Cashier" 
        component={CashierScreen}
        options={{ title: 'Point of Sale' }}
      />
    </Stack.Navigator>
  );
}