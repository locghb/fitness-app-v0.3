import { useState, useEffect } from 'react';
import { getFoodList } from '../lib/spoonacular'; // Import hàm từ Spoonacular API

interface UseNutritionParams {
  query: string;
  minCalories: number;
  maxCalories: number;
  diet: 'vegetarian' | 'non-vegetarian';
}

export const useNutrition = ({ query, minCalories, maxCalories, diet }: UseNutritionParams) => {
  const [foods, setFoods] = useState<any[]>([]); // Lưu trữ danh sách món ăn
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState<string>(''); // Lỗi nếu có

  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      setError('');
      try {
        const foodData = await getFoodList({
          query,
          minCalories,
          maxCalories,
          diet,
        });
        setFoods(foodData); // Lưu món ăn vào state
        console.log('Fetched Foods:', foodData); // Log dữ liệu từ Spoonacular API
      } catch (err) {
        setError('Failed to fetch food data'); // Set lỗi nếu có
        console.error(err);
      } finally {
        setLoading(false); // Dừng trạng thái loading
      }
    };

    fetchFoodData();
  }, [query, minCalories, maxCalories, diet]); // Khi query, calo hoặc chế độ ăn thay đổi, fetch lại dữ liệu

  return { foods, loading, error };
};
