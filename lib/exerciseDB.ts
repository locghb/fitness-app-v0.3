// fitness-app-v0.2/lib/exerciseDB.ts - Đã sửa lỗi khai báo lại
import axios from 'axios';
// import Constants from 'expo-constants'; //
// Chỉ giữ lại dòng hardcode này 
const apiKey = "2b92f02a40mshb86100e8188a10dp13e269jsn77f3e5b00fba";
console.log('API Key (Hardcoded để debug):', apiKey);

const apiHost = 'exercisedb.p.rapidapi.com';
const baseUrl = 'https://exercisedb.p.rapidapi.com';

// Thêm kiểm tra để đảm bảo key không rỗng trước khi tạo client
if (typeof apiKey !== 'string' || !apiKey) {
  console.error("API Key bị thiếu hoặc không hợp lệ! Không thể tạo API client.");
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': apiHost,
  },
});
// Định nghĩa kiểu dữ liệu trả về từ API (sẽ chi tiết hơn ở bước sau)
export interface Exercise {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export const fetchBodyParts = async (): Promise<string[]> => {
    // Thêm kiểm tra key trước khi gọi API
    if (!apiKey) {
        console.error("Skipping fetchBodyParts: API Key is missing");
        return Promise.resolve([]); // Trả về mảng rỗng nếu thiếu key
    }
    try {
        const response = await api.get('/exercises/bodyPartList');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch body parts:', error); // Giữ lại log lỗi
        return []; // Trả về mảng rỗng khi có lỗi
    }
};

export const fetchExercisesByBodyPart = async (
  bodyPart: string
): Promise<Exercise[]> => {
  try {
    // Giới hạn số lượng bài tập trả về bằng param limit (ví dụ: 50) để tránh quá tải
    const response = await api.get(
      `/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=50`
    );
    // console.log(`Exercises for ${bodyPart} Response:`, response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch exercises for body part ${bodyPart}:`,
      error
    );
    return [];
  }
};

export const fetchExerciseById = async (
  id: string
): Promise<Exercise | null> => {
  try {
    const response = await api.get(`/exercises/exercise/${id}`);
    // console.log(`Exercise Detail for ${id} Response:`, response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch exercise with id ${id}:`, error);
    return null;
  }
};
