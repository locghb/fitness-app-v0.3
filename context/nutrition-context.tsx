import React, { createContext, useContext, useReducer } from 'react';
import { NutritionItem } from '../types/nutrition'; // Đảm bảo đúng đường dẫn

type MealType = 'breakfast' | 'lunch' | 'dinner';
const MAX_RECENT_ITEMS = 10; // Giới hạn số lượng món ăn gần đây (có thể điều chỉnh)

// Thêm recentItems vào State
interface NutritionState {
  meals: {
    breakfast: NutritionItem[];
    lunch: NutritionItem[];
    dinner: NutritionItem[];
  };
  recentItems: NutritionItem[]; // Danh sách món ăn gần đây
}

type NutritionAction =
  | { type: 'ADD_FOOD'; payload: { food: NutritionItem; meal: MealType } }
  | { type: 'RESET' };

// Thêm recentItems vào Context value type
const NutritionContext = createContext<{
  state: NutritionState;
  addFood: (food: NutritionItem, meal: MealType) => void;
  reset: () => void;
} | null>(null);

// Khởi tạo recentItems rỗng
const initialState: NutritionState = {
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
  },
  recentItems: [],
};

function nutritionReducer(state: NutritionState, action: NutritionAction): NutritionState {
  switch (action.type) {
    case 'ADD_FOOD':
      const { meal, food } = action.payload;

      // Cập nhật danh sách món ăn gần đây
      // 1. Lọc bỏ món ăn trùng ID (nếu đã có) khỏi danh sách cũ
      const filteredRecent = state.recentItems.filter(item => item.id !== food.id);
      // 2. Thêm món ăn mới vào đầu danh sách
      const updatedRecentItems = [food, ...filteredRecent];
      // 3. Giới hạn số lượng món ăn trong danh sách
      const finalRecentItems = updatedRecentItems.slice(0, MAX_RECENT_ITEMS);

      // Trả về state mới với meals và recentItems đã cập nhật
      return {
        meals: {
          ...state.meals,
          [meal]: [...state.meals[meal], food], // Thêm món ăn vào bữa
        },
        recentItems: finalRecentItems, // Cập nhật danh sách gần đây
      };
    case 'RESET':
      // Reset cả meals và recentItems
      return initialState;
    default:
      return state;
  }
}

// Provider không cần thay đổi cách hoạt động, chỉ cần đảm bảo state mới được truyền đi
export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(nutritionReducer, initialState);

  const addFood = (food: NutritionItem, meal: MealType) => {
    dispatch({ type: 'ADD_FOOD', payload: { food, meal } });
  };

  const reset = () => dispatch({ type: 'RESET' });

  // Giá trị context giờ đã bao gồm state.recentItems
  return (
    <NutritionContext.Provider value={{ state, addFood, reset }}>
      {children}
    </NutritionContext.Provider>
  );
};

// Hook useContext không đổi
export const useNutritionContext = () => {
  const context = useContext(NutritionContext);
  if (!context) throw new Error('useNutritionContext must be used within NutritionProvider');
  return context;
};