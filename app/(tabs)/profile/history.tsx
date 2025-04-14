import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const historyData = [
  {
    id: '1',
    dateTime: 'Saturday, 4:30 PM',
    date: 'July 6, 2025',
    totalTime: '03:04',
    note: 'Note',
  },
  {
    id: '2',
    dateTime: 'Saturday, 4:30 PM',
    date: 'July 6, 2025',
    totalTime: '03:04',
    note: 'Note',
  },
];

const HistoryItem = ({ dateTime, date, totalTime, note, selected }) => (
  <View style={[styles.historyItem, selected && styles.selectedItem]}>
    <Text style={styles.dateTime}>{dateTime}</Text>
    <Text style={styles.date}>{date}</Text>
    <Text style={styles.totalTime}>Total time: {totalTime}</Text>
    <Text style={styles.note}>{note}</Text>
  </View>
);

const HistoryScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile/userprofile")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>
      <FlatList
        data={historyData}
        renderItem={({ item, index }) => (
          <HistoryItem
            dateTime={item.dateTime}
            date={item.date}
            totalTime={item.totalTime}
            note={item.note}
            selected={index === 1} // Assuming the second item is selected
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF9500',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  historyItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
    borderColor: '#bbb',
  },
  dateTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  totalTime: {
    fontSize: 14,
    color: 'gray',
  },
  note: {
    fontSize: 14,
    color: 'gray',
  },
});

export default HistoryScreen;