import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface Props {
  size: number;       // Kích thước vòng tròn
  width: number;      // Độ dày vòng tròn
  eaten: number;      // Calo đã ăn
  remaining: number;  // Calo còn lại
  total: number;      // Tổng calo mục tiêu
  tintColor?: string; // Màu vòng tròn (optional)
  backgroundColor?: string; // Màu nền vòng tròn (optional)
}

// Đổi tên component cho rõ ràng
export function CalorieSummaryCircle({
  size,
  width,
  eaten,
  remaining,
  total,
  tintColor = "#4caf50", // Màu mặc định
  backgroundColor = "#1B263B" // Màu nền mặc định tối, giống meal item
}: Props) {
  // Tính phần trăm fill dựa trên eaten và total, tránh chia cho 0
  const fill = total > 0 ? Math.min((eaten / total) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={size}
        width={width}
        fill={fill}
        tintColor={tintColor}
        backgroundColor={backgroundColor}
        rotation={0}
        lineCap="round"
      >
        {(fill) => (
          <View style={styles.centerContent}>
            {/* Làm tròn giá trị remaining */}
            <Text style={[styles.remainingValue, { fontSize: size * 0.25 }]}>{Math.round(remaining)}</Text>
            <Text style={[styles.remainingLabel, { fontSize: size * 0.12 }]}>Remaining</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    // Đảm bảo nội dung luôn ở giữa, bất kể kích thước component
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  remainingValue: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    // fontSize được tính động
  },
  remainingLabel: {
    color: '#A9B4C2',
    // fontSize được tính động
    marginTop: 4,
  },
});