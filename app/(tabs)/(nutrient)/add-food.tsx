import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, SectionList, // Đã thêm SectionList
  ActivityIndicator, TouchableOpacity, Image, Keyboard, ScrollView
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getFoodList } from '../../../lib/spoonacular'; // Đảm bảo đúng đường dẫn
import { useNutrition } from '../../../hooks/useNutrition';
import { useNutritionContext } from '../../../context/nutrition-context';
import { NutritionItem } from '../../../types/nutrition';

// Đã đổi tên TabName và cập nhật TABS
type TabName = 'Search' | 'Diary' | 'Meals' | 'Recipes'; // 'Diary' thay cho 'My Foods'
const TABS: TabName[] = ['Search', 'Diary', 'Meals', 'Recipes'];

export default function AddFoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType?: string }>();
  const mealType = params.mealType || 'Meal';
  const screenTitle = `Add to ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`;

  // Lấy state.meals để dùng cho tab Diary
  const { addFood, state } = useNutritionContext();
  const { recentItems, meals } = state; // Lấy meals và recentItems

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabName>('Search');

  const [suggestions, setSuggestions] = useState<NutritionItem[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(true);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  // useEffect Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length >= 3) { setDebouncedQuery(searchQuery.trim()); }
      else { setDebouncedQuery(''); }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // useMemo cho Search Params
  const searchParams = useMemo(() => {
    const baseParams = { query: debouncedQuery, minCalories: 0, maxCalories: 1000, diet: 'non-vegetarian' as 'vegetarian' | 'non-vegetarian', };
    // Có thể thêm logic khác cho tab Recipes ở đây nếu cần
    return baseParams;
  }, [debouncedQuery, activeTab]); // Chỉ phụ thuộc query và tab

  // useNutrition Hook (Chỉ gọi khi cần search)
  const { foods: searchResults, loading: searchLoading, error: searchError } = useNutrition(searchParams);

  // useEffect tải Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestionsLoading(true); setSuggestionsError(null);
      try {
        const suggestionParams = { query: '', maxCalories: 400, minCalories: 0, diet: 'non-vegetarian' as 'vegetarian' | 'non-vegetarian', number: 10 };
        const fetchedSuggestions = await getFoodList(suggestionParams);
        setSuggestions(fetchedSuggestions);
      } catch (err) { setSuggestionsError("Could not load suggestions."); console.error("Failed to fetch suggestions:", err); }
      finally { setSuggestionsLoading(false); }
    };
    fetchSuggestions();
  }, []); // Chạy 1 lần

  // handleSelectFood
  const handleSelectFood = (item: NutritionItem) => {
    Keyboard.dismiss();
    const validMealType = mealType as 'breakfast' | 'lunch' | 'dinner';
    if (['breakfast', 'lunch', 'dinner'].includes(validMealType)) {
      addFood(item, validMealType); // Luôn thêm vào bữa ăn hiện tại đang chọn
      router.back(); // Quay lại màn hình chính
    } else { console.error("Invalid meal type:", mealType); }
  };

  // Component Render Item (Dùng chung)
  const RenderItemComponent = ({ item }: { item: NutritionItem }) => (
    <TouchableOpacity style={styles.foodItem} onPress={() => handleSelectFood(item)}>
      <Image source={{ uri: item.image }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.foodCalories}>{Math.round(item.calories)} Cal</Text>
        <Text style={styles.foodMacros} numberOfLines={1}>
          P: {Math.round(item.protein)}g | C: {Math.round(item.carbs)}g | F: {Math.round(item.fat)}g
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Chuẩn bị dữ liệu cho SectionList của tab Diary
  const diarySections = useMemo(() => {
    const sections = [];
    if (meals.breakfast.length > 0) { sections.push({ title: 'Breakfast', data: meals.breakfast }); }
    if (meals.lunch.length > 0) { sections.push({ title: 'Lunch', data: meals.lunch }); }
    if (meals.dinner.length > 0) { sections.push({ title: 'Dinner', data: meals.dinner }); }
    return sections;
  }, [meals]); // Tính lại khi meals thay đổi

  // --- Render Chính ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: screenTitle }} />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={22} color="#CCCCCC" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search food or brand" placeholderTextColor="#CCCCCC" value={searchQuery} onChangeText={setSearchQuery} returnKeyType="search" autoCapitalize="none" autoCorrect={false} onBlur={() => Keyboard.dismiss()} />
        {searchQuery.length > 0 && (<TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}><MaterialCommunityIcons name="close-circle" size={20} color="#CCCCCC" /></TouchableOpacity>)}
      </View>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tabName) => (
          <TouchableOpacity key={tabName} style={[styles.tabButton, activeTab === tabName && styles.tabButtonActive]} onPress={() => setActiveTab(tabName)}>
            <Text style={[styles.tabButtonText, activeTab === tabName && styles.tabButtonTextActive]}>{tabName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {/* Loading/Error chung cho search (chỉ hiển thị khi tab Search/Recipes active và có query) */}
        {(activeTab === 'Search' || activeTab === 'Recipes') && searchLoading && <ActivityIndicator size="large" color="#00C853" style={styles.loader} />}
        {(activeTab === 'Search' || activeTab === 'Recipes') && searchError && !searchLoading && <Text style={styles.errorText}>{searchError}</Text>}

        {/* --- Nội dung Tab Search --- */}
        {activeTab === 'Search' && !searchLoading && !searchError && (
          debouncedQuery.length > 0 ? (
            <FlatList data={searchResults} renderItem={RenderItemComponent} keyExtractor={(item) => `search-${item.id}`} ListEmptyComponent={<Text style={styles.emptyText}>No food found for "{debouncedQuery}".</Text>} contentContainerStyle={styles.listContentContainer} keyboardShouldPersistTaps="handled" onScrollBeginDrag={() => Keyboard.dismiss()} />
          ) : ( // Khi không search
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.noSearchContentContainer}>
              {suggestionsLoading && <ActivityIndicator size="large" color="#00C853" style={[styles.loader, { marginTop: 20 }]} />}
              {suggestionsError && !suggestionsLoading && <Text style={[styles.errorText, { marginTop: 20 }]}>{suggestionsError}</Text>}
              {!suggestionsLoading && !suggestionsError && suggestions.length > 0 && (
                <View style={styles.suggestionSection}>
                  <Text style={styles.suggestionTitle}>Suggestions (Low Calorie)</Text>
                  {suggestions.map(item => <RenderItemComponent key={`suggestion-${item.id}`} item={item} />)}
                </View>
              )}
              {!suggestionsLoading && (suggestionsError || suggestions.length === 0) && recentItems.length > 0 && (
                <View style={styles.recentSection}>
                  <Text style={styles.recentTitle}>Recent</Text>
                  {recentItems.map(item => <RenderItemComponent key={`recent-${item.id}`} item={item} />)}
                </View>
              )}
              {!suggestionsLoading && !suggestionsError && suggestions.length === 0 && recentItems.length === 0 && (
                <Text style={styles.placeholderTextLarge}>Type 3+ characters to search.</Text>
              )}
            </ScrollView>
          )
        )}

        {/* --- Nội dung Tab Diary --- */}
        {activeTab === 'Diary' && !searchLoading && !searchError && ( // Ẩn khi đang search ở tab khác
          diarySections.length > 0 ? (
            <SectionList
              sections={diarySections}
              keyExtractor={(item, index) => `diary-${item.id}-${index}`}
              renderItem={({ item }) => <RenderItemComponent item={item} />}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.diarySectionHeader}>{title}</Text>
              )}
              contentContainerStyle={styles.listContentContainer}
              stickySectionHeadersEnabled={false}
              keyboardShouldPersistTaps="handled" // Cho phép nhấn vào item khi bàn phím đang mở (nếu có)
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No food recorded for today yet.</Text>
            </View>
          )
        )}

        {/* --- Nội dung Tab Recipes --- */}
        {activeTab === 'Recipes' && !searchLoading && !searchError && (
          debouncedQuery.length > 0 ? (
            <FlatList data={searchResults} renderItem={RenderItemComponent} keyExtractor={(item) => `recipe-${item.id}`} ListEmptyComponent={<Text style={styles.emptyText}>No recipes found for "{debouncedQuery}".</Text>} contentContainerStyle={styles.listContentContainer} keyboardShouldPersistTaps="handled" onScrollBeginDrag={() => Keyboard.dismiss()} />
          ) : (
            <View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Type 3+ characters to search for recipes.</Text></View>
          )
        )}

        {/* --- Placeholder Tab Meals --- */}
        {activeTab === 'Meals' && (<View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Meals: To be implemented.</Text></View>)}
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0D1B2A' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1B263B', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, marginHorizontal: 15, marginTop: 10, marginBottom: 10, },
  searchIcon: { marginRight: 10 }, searchInput: { flex: 1, fontSize: 16, color: '#FFFFFF', paddingVertical: 0 }, clearIcon: { marginLeft: 10, padding: 2 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#0D1B2A', paddingHorizontal: 5, paddingTop: 5, borderBottomWidth: 1.5, borderBottomColor: '#1B263B', },
  tabButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderBottomWidth: 3, borderBottomColor: 'transparent', },
  tabButtonActive: { borderBottomColor: '#00C853', }, tabButtonText: { color: '#E0E1DD', fontSize: 14, fontWeight: '600', textAlign: 'center', }, tabButtonTextActive: { color: '#FFFFFF', fontWeight: 'bold', },
  contentArea: { flex: 1 }, loader: { marginTop: 50 }, errorText: { color: '#FCA5A5', textAlign: 'center', marginTop: 30, paddingHorizontal: 20, fontSize: 15 },
  listContentContainer: { paddingHorizontal: 15, paddingBottom: 20, paddingTop: 5 }, // Giảm paddingTop chung
  placeholderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 }, // Thêm justifyContent
  placeholderText: { color: '#A9B4C2', textAlign: 'center', fontSize: 16, lineHeight: 24, }, // Bỏ margin bottom
  placeholderTextLarge: { color: '#A9B4C2', textAlign: 'center', fontSize: 16, lineHeight: 24, marginTop: 60, paddingHorizontal: 30, },
  emptyText: { color: '#A9B4C2', textAlign: 'center', marginTop: 50, fontSize: 16, paddingHorizontal: 20 },
  noSearchContentContainer: { paddingBottom: 20 }, // Style cho ScrollView khi không search
  suggestionSection: { width: '100%', paddingHorizontal: 15, marginBottom: 20 },
  suggestionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15, marginTop: 15, },
  recentSection: { width: '100%', paddingHorizontal: 15, marginBottom: 20 },
  recentTitle: { fontSize: 18, fontWeight: '600', color: '#E0E1DD', marginBottom: 15, marginTop: 10, },
  foodItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1B263B', padding: 12, borderRadius: 10, marginBottom: 12 },
  foodImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#334155' }, foodInfo: { flex: 1 },
  foodTitle: { color: '#E0E1DD', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  foodCalories: { color: '#00C853', fontSize: 14, fontWeight: 'bold', marginBottom: 4 }, foodMacros: { color: '#A9B4C2', fontSize: 12 },
  diarySectionHeader: { // Style cho tiêu đề section của Diary
    fontSize: 18, fontWeight: '600', color: '#E0E1DD', backgroundColor: '#1B263B',
    paddingVertical: 8, paddingHorizontal: 15, marginTop: 15, marginBottom: 5,
  }
});