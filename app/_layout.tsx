import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { theme } from "./styles/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CashierStack } from "./stacks/CashierStack";
import { ProductStack } from "./stacks/ProductStack";
import { ScannerStack } from "./stacks/ScannerStack";
const Tab = createBottomTabNavigator();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['left', 'right']}>
 <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === "Inventory") {
                    iconName = focused ? "list" : "list-outline";
                  } else if (route.name === "Scanner") {
                    iconName = focused ? "scan" : "scan-outline";
                  } else if (route.name === "Cashier") {
                    iconName = focused ? "cash" : "cash-outline";
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#2196F3",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
              })}
            >
              <Tab.Screen name="Inventory" component={ProductStack} />
              <Tab.Screen name="Scanner" component={ScannerStack} />
              <Tab.Screen name="Cashier" component={CashierStack} />
            </Tab.Navigator>      
              </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}