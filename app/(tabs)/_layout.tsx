// fitness-app-v0.2/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Home, Dumbbell, Apple, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      {/* Màn hình Trang chủ */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      {/* !!! ĐẢM BẢO CHỈ CÓ MỘT MÀN HÌNH exercises Ở ĐÂY !!! */}
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Bài tập",
          tabBarIcon: ({ color, size }) => (
            <Dumbbell color={color} size={size} />
          ),
        }}
      />
      {/* Xóa bất kỳ <Tabs.Screen name="exercises" ... /> nào khác nếu có */}

      {/* Màn hình Dinh dưỡng */}
      <Tabs.Screen
        name="(nutrient)"
        options={{
          title: "Dinh dưỡng",
          tabBarIcon: ({ color, size }) => <Apple color={color} size={size} />,
        }}
      />

      {/* Màn hình Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
