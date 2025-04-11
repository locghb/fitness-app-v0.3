import { Stack } from 'expo-router';
import { NutritionProvider } from '../../../context/nutrition-context';

export default function Layout() {
  return (
    <NutritionProvider>
      <Stack screenOptions={{headerShown: false}}/>
    </NutritionProvider>
  );
}