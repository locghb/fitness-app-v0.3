// fitness-app-v0.2/app/exerciseDetail/[exerciseId].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
// Đường dẫn từ app/exerciseDetail/ lên app/ rồi vào lib/
import { fetchExerciseById, Exercise } from "../../lib/exerciseDB";
import { StatusBar } from "expo-status-bar";

export default function ExerciseDetailScreen() {
  // Lấy exerciseId từ tham số URL
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log(`Workspaceing detail for exercise ID: ${exerciseId}`); // Debugging
        const data = await fetchExerciseById(exerciseId);
        if (data) {
          setExercise(data);
        } else {
          setError("Không tìm thấy chi tiết bài tập.");
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải chi tiết bài tập. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadExerciseDetail();
  }, [exerciseId]); // Chạy lại khi exerciseId thay đổi

  // Viết hoa chữ cái đầu của tên bài tập
  const capitalizedName = exercise?.name
    ? exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)
    : "Chi tiết bài tập";

  // Hiển thị loading
  if (loading) {
    return (
      <View style={styles.center}>
        {/* Đặt tạm title */}
        <Stack.Screen options={{ title: "Đang tải..." }} />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Lỗi" }} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Trường hợp không tìm thấy bài tập (API trả về null hoặc lỗi)
  if (!exercise) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Không tìm thấy" }} />
        <Text style={styles.errorText}>
          Không tìm thấy dữ liệu cho bài tập này.
        </Text>
      </View>
    );
  }

  // Hàm helper để hiển thị danh sách text (Hướng dẫn, Nhóm cơ phụ)
  const renderTextList = (title: string, items: string[] | undefined) => {
    if (!items || items.length === 0) return null; // Không hiển thị nếu không có item
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map((item, index) => (
          // Viết hoa chữ cái đầu của mỗi mục
          <Text key={index} style={styles.listItem}>
            • {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        ))}
      </View>
    );
  };

  // Hiển thị chi tiết bài tập
  return (
    // Sử dụng ScrollView để nội dung dài có thể cuộn
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style="dark" />
      {/* Đặt title header bằng tên bài tập */}
      <Stack.Screen options={{ title: capitalizedName }} />

      {/* Ảnh GIF */}
      <Image
        source={{ uri: exercise.gifUrl }}
        style={styles.gif}
        resizeMode="contain"
      />

      {/* Tên bài tập */}
      <Text style={styles.exerciseName}>{capitalizedName}</Text>

      {/* Thông tin cơ bản */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Nhóm cơ chính:</Text>
        <Text style={styles.infoValue}>{exercise.target}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Dụng cụ:</Text>
        <Text style={styles.infoValue}>{exercise.equipment}</Text>
      </View>

      {/* Nhóm cơ phụ */}
      {renderTextList("Nhóm cơ phụ:", exercise.secondaryMuscles)}

      {/* Hướng dẫn */}
      {renderTextList("Hướng dẫn:", exercise.instructions)}
    </ScrollView>
  );
}

// Styles cho màn hình chi tiết
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Nền trắng cho sạch sẽ
  },
  contentContainer: {
    padding: 20, // Padding xung quanh nội dung
    paddingBottom: 40, // Thêm padding dưới cùng
  },
  center: {
    // Style cho trạng thái loading/error
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  gif: {
    width: "100%",
    height: 300, // Chiều cao cố định cho GIF
    backgroundColor: "#f0f0f0", // Màu nền chờ tải ảnh
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 10, // Bo góc nhẹ
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    textTransform: "capitalize", // Viết hoa chữ cái đầu
  },
  infoRow: {
    // Style cho các hàng thông tin (Nhóm cơ, Dụng cụ)
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start", // Căn chỉnh theo đầu dòng nếu text dài
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600", // In đậm nhãn
    color: "#555",
    marginRight: 8,
    minWidth: 120, // Đảm bảo các giá trị được căn chỉnh thẳng hàng
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1, // Cho phép text giá trị tự động xuống dòng
    textTransform: "capitalize",
  },
  section: {
    // Style cho các phần (Nhóm cơ phụ, Hướng dẫn)
    marginTop: 15,
    marginBottom: 10,
    borderTopWidth: 1, // Thêm đường kẻ phân cách nhẹ
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Tăng khoảng cách dưới tiêu đề phần
    color: "#444",
  },
  listItem: {
    // Style cho từng mục trong danh sách Hướng dẫn/Cơ phụ
    fontSize: 16,
    color: "#333",
    marginBottom: 8, // Tăng khoảng cách giữa các mục
    lineHeight: 24, // Tăng chiều cao dòng cho dễ đọc
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
