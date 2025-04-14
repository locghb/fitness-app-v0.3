import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const achievementsData = [
  {
    id: '1',
    icon: 'trophy',
    title: 'First Steps',
    description: 'Complete your first task',
  },
  {
    id: '2',
    icon: 'star',
    title: 'Star Performer',
    description: 'Achieve a 5-star rating',
  },
  {
    id: '3',
    icon: 'tag',
    title: 'Medalist',
    description: 'Win a medal in a competition',
  },
];

const AchievementItem = ({ icon, title, description }) => (
  <View style={styles.achievementItem}>
    <FontAwesome name={icon} size={24} color="gold" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);


const AchievementsScreen = () => {
    const router = useRouter();
    const handleBack = async() =>{
      router.replace("/(tabs)/profile/userprofile")
    }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={(handleBack)} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
      </View>
      <FlatList
        data={achievementsData}
        renderItem={({ item }) => (
          <AchievementItem
            icon={item.icon}
            title={item.title}
            description={item.description}
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
});

export default AchievementsScreen;