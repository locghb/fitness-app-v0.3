import axios from 'axios';

// API Key và URL của Spoonacular API
const API_KEY = 'fad73fc9c9c6416c8cf3a0175a43c219';
const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';

// Interface cho các tham số khi gọi API
interface FoodParams {
  query: string;
  minCalories: number;
  maxCalories: number;
  diet: 'vegetarian' | 'non-vegetarian';
}

// Hàm lấy danh sách món ăn từ Spoonacular
export const getFoodList = async ({
  query,
  minCalories,
  maxCalories,
  diet,
}: FoodParams) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apiKey: API_KEY, // API Key
        query, // Từ khóa tìm kiếm món ăn
        minCalories, // Giới hạn calo tối thiểu
        maxCalories, // Giới hạn calo tối đa
        diet: diet === 'non-vegetarian' ? undefined : 'vegetarian', // Chế độ ăn, nếu là non-vegetarian thì không cần thêm tham số này
        addRecipeNutrition: true, // Thêm thông tin dinh dưỡng
        number: 10, // Số lượng món ăn trả về
      },
    });

    // Xử lý dữ liệu trả về từ Spoonacular API
    return response.data.results.map((item: any) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      calories:
        item.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount ?? 0,
      fat: item.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount ?? 0,
      protein:
        item.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount ?? 0,
      carbs:
        item.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount ?? 0,
    }));
  } catch (error) {
    console.error('Spoonacular API error:', error); // Log lỗi nếu có
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};
