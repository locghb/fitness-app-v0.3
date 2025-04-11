import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  color: string; // Màu của thanh progress
}

export function MacroProgressBar({
  label,
  currentValue,
  targetValue,
  unit,
  color,
}: Props) {
  // Tính phần trăm, đảm bảo không vượt quá 100% và không chia cho 0
  const percentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;
  const displayCurrent = Math.round(currentValue); // Làm tròn giá trị hiển thị
  const displayTarget = Math.round(targetValue); // Làm tròn mục tiêu

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>
          {displayCurrent} / {displayTarget} {unit}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: color }, // Set width và màu
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Để các thanh chia sẻ không gian đều nhau
    marginHorizontal: 6, // Tăng khoảng cách ngang
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6, // Tăng khoảng cách dưới
  },
  label: {
    color: '#A9B4C2',
    fontSize: 13,
    fontWeight: '500', // Hơi đậm hơn chút
  },
  valueText: {
    color: '#E0E1DD',
    fontSize: 13,
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#1B263B', // Màu nền thanh progress
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});