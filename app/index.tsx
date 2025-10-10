
import { NavigationContainer ,NavigationIndependentTree} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProductStack } from './stacks/ProductStack';
import { ScannerStack } from './stacks/ScannerStack';
import {CashierStack} from './stacks/CashierStack'
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './styles/theme';
const Tab = createBottomTabNavigator();

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <NavigationIndependentTree>
      <NavigationContainer linking={undefined}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                
                if (route.name === 'Inventory') {
                  iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Scanner') {
                  iconName = focused ? 'scan' : 'scan-outline';
                }
                
                return <Ionicons  size={size} color={color} />;
              },
              tabBarActiveTintColor: '#2196F3',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
            >
          <Tab.Screen name="Inventory" component={ProductStack} />
        <Tab.Screen name="Scanner" component={ScannerStack} />
        <Tab.Screen name="Cashier" component={CashierStack} />
          </Tab.Navigator>
              </NavigationContainer>
              </NavigationIndependentTree>
            </PaperProvider>
  );
}