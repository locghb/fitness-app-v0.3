import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Import lại type NutritionItem
import { NutritionItem as FoodItemType } from '../types/nutrition'; // Đảm bảo đường dẫn đúng

interface Props {
  mealName: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  eatenCalories: number;
  targetCalories?: number;
  foodItems: FoodItemType[]; // Nhận mảng món ăn đầy đủ
  onAddPress: () => void;
}

export function MealItem({
  mealName,
  iconName,
  eatenCalories,
  targetCalories = 0, // Giá trị mặc định tạm
  foodItems = [], // Mảng món ăn, mặc định rỗng
  onAddPress,
}: Props) {
  const displayEaten = Math.round(eatenCalories);
  const displayTarget = Math.round(targetCalories);

  // Tạo chuỗi tóm tắt món ăn
  const foodSummary = foodItems
                       .slice(0, 3) // Lấy tối đa 3 món đầu
                       .map(item => item.title) // Lấy tên món ăn
                       .join(', '); // Nối bằng dấu phẩy và khoảng trắng
  const hasMoreItems = foodItems.length > 3; // Kiểm tra xem có nhiều hơn 3 món không

  return (
    <View style={styles.container}>
      {/* Phần Icon và Text */}
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons name={iconName} size={32} color="#A9B4C2" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.mealName}>{mealName}</Text>
          <Text style={styles.calorieText}>
             {/* Chỉ hiển thị target nếu > 0 */}
             {displayEaten}{targetCalories > 0 ? ` / ${displayTarget}` : ''} Cal
          </Text>
          {/* Hiển thị tóm tắt món ăn nếu mảng foodItems không rỗng */}
          {foodItems.length > 0 && (
            <Text style={styles.foodListText} numberOfLines={1} ellipsizeMode="tail">
              {foodSummary}{hasMoreItems ? '...' : ''}
            </Text>
          )}
        </View>
      </View>

      {/* Nút Thêm (+) */}
      <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// --- Styles (Đã thêm style cho foodListText) ---
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1B263B', paddingVertical: 15, paddingHorizontal: 20,
    borderRadius: 12, marginBottom: 15,
  },
  infoContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  icon: { marginRight: 15 },
  textContainer: { flex: 1 },
  mealName: { color: '#E0E1DD', fontSize: 17, fontWeight: '600', marginBottom: 4 },
  calorieText: { color: '#A9B4C2', fontSize: 14, marginBottom: 3 }, // Điều chỉnh MB
  // Style cho tóm tắt món ăn
  foodListText: {
    color: '#8A9AAB', // Màu nhạt hơn
    fontSize: 13,      // Cỡ chữ nhỏ
    fontStyle: 'italic',
    marginTop: 3,      // Khoảng cách với dòng calo
  },
  addButton: {
    backgroundColor: '#00C853', borderRadius: 18, width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center',
  },
});