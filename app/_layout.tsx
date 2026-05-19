import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { IngredientsProvider } from '@features/ingredients/contexts/IngredientsContext';
import { MenuProvider } from '@features/menus/contexts/MenuContext';
import { PizzaCreationProvider } from '@features/pizzaEditor/contexts/PizzaCreationContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useColorScheme from '../src/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <IngredientsProvider>
        <MenuProvider>
          <PizzaCreationProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="create-pizza" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </PizzaCreationProvider>
        </MenuProvider>
      </IngredientsProvider>
    </ThemeProvider>
  );
}
