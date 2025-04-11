// fitness-app-v0.2/app/exerciseDetail/[exerciseId].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity, // Thêm TouchableOpacity
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router"; // Thêm useRouter
import { StatusBar } from "expo-status-bar";

// Đường dẫn đến fetch và type Exercise
import { fetchExerciseById, Exercise } from "../../lib/exerciseDB"; // Đảm bảo đường dẫn đúng

// Đổi tên component để phản ánh chức năng mới (tùy chọn)
export default function ExercisePlaybackScreen() {
  // Lấy exerciseId từ tham số URL
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const router = useRouter(); // Khởi tạo router

  // State cho chi tiết bài tập
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // State cho nút

  // Effect để tải chi tiết bài tập
  useEffect(() => {
    const loadExerciseDetail = async () => {
      if (!exerciseId) {
        setError("Không có ID bài tập.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log(`Đang tải chi tiết cho exercise ID: ${exerciseId}`);
        const data = await fetchExerciseById(exerciseId);
        if (data) {
          setExercise(data);
        } else {
          setError("Không tìm thấy chi tiết bài tập.");
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết:", err);
        setError("Không thể tải chi tiết bài tập. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadExerciseDetail();
  }, [exerciseId]);

  // Viết hoa chữ cái đầu của tên bài tập
  const capitalizedName = exercise?.name
    ? exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)
    : "Bài tập"; // Title mặc định ngắn gọn hơn

  // Hàm xử lý khi nhấn "Hoàn thành"
  const handleComplete = () => {
    if (isProcessing || !exercise) return;
    setIsProcessing(true);
    console.log(`Hoàn thành bài tập (điều hướng): ${exercise.name}`);
    // Logic điều hướng sau khi hoàn thành
    // Ví dụ: Quay lại màn hình danh sách hoặc màn hình chính
    setTimeout(() => {
      router.back(); // Quay lại màn hình trước đó
      // Hoặc router.replace('/'); // Về màn hình chính
    }, 300); // Timeout nhỏ để thấy hiệu ứng loading
  };

  // Hàm xử lý khi nhấn "Bỏ qua"
  const handleSkip = () => {
    if (isProcessing || !exercise) return;
    console.log(`Bỏ qua bài tập (điều hướng): ${exercise.name}`);
    // Logic điều hướng sau khi bỏ qua
    router.back(); // Quay lại màn hình trước đó
  };

  // ---- Hiển thị Loading ----
  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Đang tải..." }} />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // ---- Hiển thị Lỗi ----
  if (error) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Lỗi" }} />
        <Text style={styles.errorText}>{error}</Text>
        {/* Thêm nút quay lại nếu muốn */}
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Text style={styles.goBackButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---- Trường hợp không tìm thấy bài tập ----
  if (!exercise) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Không tìm thấy" }} />
        <Text style={styles.errorText}>
          Không tìm thấy dữ liệu cho bài tập này.
        </Text>
         <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Text style={styles.goBackButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---- Hiển thị chính ----
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Đặt title header */}
      <Stack.Screen options={{ title: capitalizedName }} />

      {/* Ảnh GIF */}
      {/* Sử dụng Image chuẩn vì uri đã có */}
      <Image
        source={{ uri: exercise.gifUrl }}
        style={styles.exerciseImage} // Sử dụng style giống workout.js
        resizeMode="contain"
      />

      {/* Tên bài tập */}
      {/* Có thể thêm số set/rep nếu API trả về, hiện tại chỉ có tên */}
      <Text style={styles.exerciseName}>{capitalizedName}</Text>

      {/* Hàng nút bấm */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}
          disabled={isProcessing}
        >
          <Text style={[styles.buttonText, styles.skipButtonText]}>Bỏ qua</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleComplete}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Hoàn thành</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Styles --- (Dựa trên workout.js và điều chỉnh)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Căn giữa nội dung chính (ảnh, tên)
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff", // Nền trắng
  },
  center: { // Style cho loading/error
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  exerciseImage: {
    width: "90%", // Chiều rộng linh hoạt
    aspectRatio: 1, // Giữ tỉ lệ vuông (hoặc điều chỉnh)
    marginBottom: 30, // Khoảng cách dưới ảnh
    backgroundColor: '#f0f0f0', // Nền chờ
  },
  exerciseName: {
    fontSize: 22, // Cỡ chữ vừa phải
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40, // Khoảng cách lớn trước nút
    color: "#333",
    textTransform: "capitalize",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Phân bố đều nút
    width: "100%", // Chiếm toàn bộ chiều rộng
    position: 'absolute', // Đặt ở dưới cùng
    bottom: 40, // Khoảng cách từ đáy
    left: 20, // Cần thêm padding container hoặc left/right cho buttonRow
    right: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 130, // Chiều rộng tối thiểu
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  skipButton: {
    backgroundColor: "#eee",
  },
  completeButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  skipButtonText: {
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20, // Thêm khoảng cách trước nút Quay lại
  },
  goBackButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#007AFF",
    borderRadius: 20,
  },
  goBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});