// fitness-app-v0.2/app/(tabs)/exercises.tsx
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
import { useRouter } from "expo-router";
import { fetchBodyParts } from "../../lib/exerciseDB"; // Đảm bảo đường dẫn đúng
import { StatusBar } from "expo-status-bar";

// Ánh xạ tên nhóm cơ từ API sang tên file ảnh (nếu cần điều chỉnh)
// Key là tên từ API (viết thường, có dấu cách nếu có), value là tên file ảnh (không có phần mở rộng)
const bodyPartImageMap: { [key: string]: any } = {
  back: require("../../assets/images/back.png"), // Giả sử bạn có ảnh back.png
  cardio: require("../../assets/images/cardio.png"),
  chest: require("../../assets/images/chest.png"),
  "lower arms": require("../../assets/images/lowerArms.png"),
  "lower legs": require("../../assets/images/lowerLegs.png"),
  neck: require("../../assets/images/neck.png"),
  shoulders: require("../../assets/images/shoulders.png"),
  "upper arms": require("../../assets/images/upperArms.png"),
  "upper legs": require("../../assets/images/upperLegs.png"),
  waist: require("../../assets/images/waist.png"),
  // Thêm các nhóm cơ khác nếu có ảnh tương ứng
};

export default function ExercisesScreen() {
  const router = useRouter();
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBodyParts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBodyParts();
        if (data && data.length > 0) {
          setBodyParts(data);
        } else {
          setError("Không tìm thấy dữ liệu nhóm cơ.");
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách nhóm cơ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadBodyParts();
  }, []);

  const handlePressBodyPart = (bodyPart: string) => {
    // Chuyển hướng đến màn hình danh sách bài tập, truyền bodyPart làm param
    // Sử dụng encodeURIComponent để đảm bảo ký tự đặc biệt trong tên được xử lý đúng
    router.push(`/exercises/${encodeURIComponent(bodyPart)}`);
  };

  const renderBodyPartItem = ({ item }: { item: string }) => {
    const imageSource =
      bodyPartImageMap[item.toLowerCase()] ||
      require("../../assets/images/icon.png"); // Ảnh mặc định nếu không có

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handlePressBodyPart(item)}
      >
        <Image source={imageSource} style={styles.itemImage} />
        <Text style={styles.itemText}>
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Chọn Nhóm Cơ</Text>
      <FlatList
        data={bodyParts}
        renderItem={renderBodyPartItem}
        keyExtractor={(item) => item}
        numColumns={2} // Hiển thị 2 cột
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={styles.columnWrapper} // Style cho từng hàng
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Thêm padding để tránh status bar
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0", // Màu nền nhẹ
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between", // Phân bố không gian giữa các item trong hàng
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    width: "48%", // Chiếm gần 1 nửa chiều rộng để tạo 2 cột
  },
  itemImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#444",
    textTransform: "capitalize", // Viết hoa chữ cái đầu
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
