// fitness-app-v0.2/app/exercises/[bodyPart].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { fetchExercisesByBodyPart, Exercise } from "../../lib/exerciseDB"; // Đảm bảo có hàm này và đường dẫn đúng
import { StatusBar } from "expo-status-bar";

export default function BodyPartExercisesScreen() {
  const router = useRouter();
  const { bodyPart } = useLocalSearchParams<{ bodyPart: string }>(); // Lấy tên nhóm cơ
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decode tên nhóm cơ phòng trường hợp có ký tự đặc biệt
  const decodedBodyPart = bodyPart ? decodeURIComponent(bodyPart) : "";
  const capitalizedBodyPart = decodedBodyPart
    ? decodedBodyPart.charAt(0).toUpperCase() + decodedBodyPart.slice(1)
    : "Bài tập";

  useEffect(() => {
    if (!decodedBodyPart) {
      setError("Không có tên nhóm cơ.");
      setLoading(false);
      return;
    }

    const loadExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Đang tải bài tập cho nhóm cơ: ${decodedBodyPart}`);
        const data = await fetchExercisesByBodyPart(decodedBodyPart);
        if (data && data.length > 0) {
          setExercises(data);
        } else {
          setError(`Không tìm thấy bài tập nào cho nhóm cơ "${capitalizedBodyPart}".`);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách bài tập. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [decodedBodyPart]); // Chạy lại khi decodedBodyPart thay đổi

  const handlePressExercise = (exerciseId: string) => {
    // Chuyển hướng đến màn hình chi tiết bài tập kiểu workout
    router.push(`/exerciseDetail/${exerciseId}`);
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handlePressExercise(item.id)}
      >
        {/* Có thể hiển thị ảnh nhỏ nếu muốn, hoặc chỉ text */}
        <Image source={{ uri: item.gifUrl }} style={styles.itemImage} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
          <Text style={styles.itemSubtitle}>Mục tiêu: {item.target}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: `Đang tải ${capitalizedBodyPart}...` }} />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Lỗi" }} />
        <Text style={styles.errorText}>{error}</Text>
         <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Text style={styles.goBackButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Đặt title header bằng tên nhóm cơ */}
      <Stack.Screen options={{ title: capitalizedBodyPart }} />
      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Màu nền sáng hơn
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f8f8",
  },
  listContentContainer: {
    padding: 15,
  },
  itemContainer: {
    backgroundColor: "#fff",
    flexDirection: "row", // Hiển thị ảnh và text cạnh nhau
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 60, // Ảnh nhỏ hơn
    height: 60,
    marginRight: 15,
    borderRadius: 5, // Bo góc ảnh
    backgroundColor: '#eee', // Nền chờ
  },
  itemTextContainer: {
    flex: 1, // Cho phép text chiếm phần còn lại
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
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