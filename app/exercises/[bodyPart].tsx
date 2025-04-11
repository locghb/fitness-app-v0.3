// fitness-app-v0.2/app/(tabs)/exercises/[bodyPart].tsx (SỬA LỖI IMPORT CHO CẤU TRÚC HIỆN TẠI)
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
// *** SỬA ĐƯỜNG DẪN IMPORT Ở ĐÂY ***
import { fetchExercisesByBodyPart, Exercise } from '../../lib/exerciseDB'; 
import { StatusBar } from 'expo-status-bar';

// ... (Phần còn lại của file giữ nguyên) ...

// Component con để hiển thị một item bài tập (Không đổi)
const ExerciseListItem = React.memo(({ item, onPress }: { item: Exercise; onPress: (id: string) => void }) => (
  <TouchableOpacity style={styles.exerciseItem} onPress={() => onPress(item.id)}>
    <Image source={{ uri: item.gifUrl }} style={styles.exerciseImage} resizeMode="contain" />
    <View style={styles.exerciseInfo}>
      <Text style={styles.exerciseName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.exerciseTarget}>Nhóm cơ: {item.target}</Text>
    </View>
  </TouchableOpacity>
));

export default function ExerciseListScreen() {
  const router = useRouter();
  const { bodyPart: encodedBodyPart } = useLocalSearchParams<{ bodyPart: string }>();
  const bodyPart = decodeURIComponent(encodedBodyPart || '');

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      if (!bodyPart) {
        setError('Không có thông tin nhóm cơ.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log(`Workspaceing exercises for: ${bodyPart}`);
        const data = await fetchExercisesByBodyPart(bodyPart);
        if (data && data.length > 0) {
          setExercises(data);
        } else {
          if (data) {
             setExercises([]);
          } else {
             setError(`Không tìm thấy bài tập cho nhóm cơ: ${bodyPart}.`);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách bài tập. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [bodyPart]);

  const handlePressExercise = (exerciseId: string) => {
    // !!! QUAN TRỌNG: Vì thư mục exercises đang nằm trong (tabs),
    // đường dẫn push này có thể không hoạt động như mong đợi
    // Nó sẽ cố gắng tìm /exerciseDetail bên trong (tabs) hoặc gây lỗi.
    // Chúng ta sẽ cần tạo màn hình detail và xem xét lại đường dẫn này sau.
    router.push(`/exerciseDetail/${exerciseId}`);
  };

  const capitalizedBodyPart = bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1);

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
        <Stack.Screen options={{ title: `Lỗi` }} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: `${capitalizedBodyPart} Bài tập` }} />

      {exercises.length === 0 ? (
         <View style={styles.center}>
           <Text style={styles.infoText}>Không có bài tập nào cho nhóm cơ này.</Text>
         </View>
       ) : (
         <FlatList
           data={exercises}
           renderItem={({ item }) => <ExerciseListItem item={item} onPress={handlePressExercise} />}
           keyExtractor={(item) => item.id}
           contentContainerStyle={styles.listContainer}
         />
      )}
    </View>
  );
}

// ... (Phần styles giữ nguyên) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 2,
    alignItems: 'center',
  },
  exerciseImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
    textTransform: 'capitalize',
  },
  exerciseTarget: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  exerciseEquipment: {
    fontSize: 13,
    color: '#888',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
    infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});