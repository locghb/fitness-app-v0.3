// fitness-app-v0.2/app/exercises/_layout.tsx  (ĐÃ DI CHUYỂN VÀ SỬA LỖI)
import { Stack } from 'expo-router';
import React from 'react';

export default function ExercisesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#f0f0f0' }, // Màu nền header (tùy chỉnh)
        headerTintColor: '#000', // Màu chữ và nút back
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // ĐÃ XÓA DÒNG GÂY LỖI headerBackTitleVisible: false,
      }}
    >
      {/* Màn hình danh sách bài tập, options cụ thể sẽ đặt trong file [bodyPart].tsx */}
      <Stack.Screen name="[bodyPart]" />
      {/* Màn hình chi tiết bài tập (sẽ thêm ở bước sau) */}
      {/* <Stack.Screen name="detail/[exerciseId]" /> */}
    </Stack>
  );
}