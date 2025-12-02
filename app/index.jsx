import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CashierStack } from "./stacks/CashierStack";
import { ProductStack } from "./stacks/ProductStack";
import { ScannerStack } from "./stacks/ScannerStack";
import { theme } from "./styles/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
     
    </SafeAreaProvider>
  );
}