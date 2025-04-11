// fitness-app-v0.2/app/exerciseDetail/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function ExerciseDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#f0f0f0' }, // Màu nền header (tùy chỉnh)
        headerTintColor: '#000', // Màu chữ và nút back
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Đăng ký màn hình chi tiết, options cụ thể đặt trong file [exerciseId].tsx */}
      <Stack.Screen name="[exerciseId]" />
    </Stack>
  );
}