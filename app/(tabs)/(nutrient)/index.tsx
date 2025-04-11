import React, { useEffect, useRef } from 'react'; 
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert // Giữ lại nếu cần
} from 'react-native';
// Import icon library
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Import useRouter từ expo-router để điều hướng
import { useRouter } from 'expo-router';

// Import các components và context
import { useNutritionContext } from '../../../context/nutrition-context';
import { CalorieSummaryCircle } from '../../../components/progress-circle'; // Đảm bảo tên file/component đúng
import { MacroProgressBar } from '../../../components/MacroProgressBar';
import { MealItem } from '../../../components/MealItem'; // Component hiển thị bữa ăn

// --- Constants & Targets (Cần làm rõ nguồn gốc sau) ---
const TOTAL_CALORIES_TARGET = 1800;
const TARGET_CARBS = 255;
const TARGET_PROTEIN = 108;
const TARGET_FAT = 41;
const TARGET_BREAKFAST = 600; // Ví dụ tạm
const TARGET_LUNCH = 600;     // Ví dụ tạm
const TARGET_DINNER = 600;     // Ví dụ tạm
// --- END Constants & Targets ---

function NutritionScreen() {
  const { state } = useNutritionContext();
  // Khởi tạo router object
  const router = useRouter();

  // --- Tính toán tổng cộng ---
  const totalCaloriesEaten = Object.values(state.meals).reduce(
    (total, mealFoods) =>
      total + mealFoods.reduce((mealTotal, item) => mealTotal + item.calories, 0),
    0
  );
  const totalCaloriesRemaining = TOTAL_CALORIES_TARGET - totalCaloriesEaten;
  const totalCarbs = Object.values(state.meals).reduce(
    (total, mealFoods) =>
      total + mealFoods.reduce((mealTotal, item) => mealTotal + item.carbs, 0),
    0
  );
  const totalProtein = Object.values(state.meals).reduce(
    (total, mealFoods) =>
      total + mealFoods.reduce((mealTotal, item) => mealTotal + item.protein, 0),
    0
  );
  const totalFat = Object.values(state.meals).reduce(
    (total, mealFoods) =>
      total + mealFoods.reduce((mealTotal, item) => mealTotal + item.fat, 0),
    0
  );
  // --- END Tính toán tổng cộng ---

  // --- Tính calo riêng cho từng bữa ---
  const breakfastCalories = state.meals.breakfast.reduce((sum, item) => sum + item.calories, 0);
  const lunchCalories = state.meals.lunch.reduce((sum, item) => sum + item.calories, 0);
  const dinnerCalories = state.meals.dinner.reduce((sum, item) => sum + item.calories, 0);

  // --- Hàm xử lý nhấn nút + (Đã cập nhật để điều hướng ở Bước 6) ---
  const handleAddFoodPress = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    router.push({
      pathname: '/add-food', // Đường dẫn dựa trên vị trí file
      params: { mealType: mealType },     // Truyền mealType làm tham số
    });
  };

  // --- Logic hiển thị thông báo khi đạt mục tiêu Calo (Thêm ở Bước 13) ---
  const previousCaloriesRef = useRef<number>(totalCaloriesEaten);

  useEffect(() => {
    const currentCalories = totalCaloriesEaten;
    const previousCalories = previousCaloriesRef.current;

    // Kiểm tra nếu VỪA đạt hoặc vượt ngưỡng
    if (currentCalories >= TOTAL_CALORIES_TARGET && previousCalories < TOTAL_CALORIES_TARGET) {
      Alert.alert(
        "Calorie Goal Reached!", // Tiêu đề
        `You've reached or exceeded your daily goal of ${TOTAL_CALORIES_TARGET} calories.`, // Nội dung
        [{ text: "OK" }] // Nút
      );
    }

    // Cập nhật giá trị trước đó cho lần kiểm tra sau
    previousCaloriesRef.current = currentCalories;

  }, [totalCaloriesEaten]); // Chạy lại khi totalCaloriesEaten thay đổi

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* --- Header --- */}
      <Text style={styles.header}>Today</Text>

      {/* --- Khu vực Summary --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        {/* Vòng tròn Calo */}
        <View style={styles.summaryCircleArea}>
           <View style={styles.summarySideText}>
           <Text style={styles.calorieTextValue}>{Math.round(totalCaloriesEaten)}</Text>
             <Text style={styles.calorieTextLabel}>Eaten</Text>
           </View>
           <CalorieSummaryCircle
              size={150} width={15}
              eaten={totalCaloriesEaten} remaining={totalCaloriesRemaining} total={TOTAL_CALORIES_TARGET}
              tintColor="#00C853" backgroundColor="#1B263B"
           />
           <View style={styles.summarySideText}>
             <Text style={styles.calorieTextValue}>{TOTAL_CALORIES_TARGET}</Text>
             <Text style={styles.calorieTextLabel}>Total</Text>
           </View>
        </View>
        {/* Thanh Macros */}
        <View style={styles.macrosContainer}>
          <MacroProgressBar
            label="Carbs" currentValue={totalCarbs} targetValue={TARGET_CARBS} unit="g" color="#3B82F6"
          />
          <MacroProgressBar
            label="Protein" currentValue={totalProtein} targetValue={TARGET_PROTEIN} unit="g" color="#EC4899"
          />
          <MacroProgressBar
            label="Fat" currentValue={totalFat} targetValue={TARGET_FAT} unit="g" color="#F59E0B"
          />
        </View>
      </View>

      {/* --- Khu vực Meals (Đã cập nhật prop foodItems ở Bước 9) --- */}
      <View style={styles.section}>
         <Text style={styles.sectionTitle}>Meals</Text>
         <MealItem
           mealName="Breakfast"
           iconName="coffee-outline"
           eatenCalories={breakfastCalories}
           targetCalories={TARGET_BREAKFAST}
           foodItems={state.meals.breakfast} // Truyền mảng món ăn để hiển thị tóm tắt
           onAddPress={() => handleAddFoodPress('breakfast')}
         />
         <MealItem
           mealName="Lunch"
           iconName="food-variant"
           eatenCalories={lunchCalories}
           targetCalories={TARGET_LUNCH}
           foodItems={state.meals.lunch} // Truyền mảng món ăn
           onAddPress={() => handleAddFoodPress('lunch')}
         />
         <MealItem
           mealName="Dinner"
           iconName="food-apple-outline"
           eatenCalories={dinnerCalories}
           targetCalories={TARGET_DINNER}
           foodItems={state.meals.dinner} // Truyền mảng món ăn
           onAddPress={() => handleAddFoodPress('dinner')}
         />
      </View>

    </ScrollView>
  );
}

// --- Styles (Không đổi so với cuối Bước 4/6) ---
const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#0D1B2A' },
   contentContainer: { padding: 20, paddingBottom: 40 },
   header: { fontSize: 28, fontWeight: 'bold', color: '#E0E1DD', marginBottom: 25 },
   section: { marginBottom: 20 },
   sectionTitle: { fontSize: 22, fontWeight: '600', color: '#E0E1DD', marginBottom: 20 },
   summaryCircleArea: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 },
   summarySideText: { alignItems: 'center', minWidth: 60 },
   calorieTextValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
   calorieTextLabel: { color: '#A9B4C2', fontSize: 13 },
   macrosContainer: { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 },
});

export default NutritionScreen; 