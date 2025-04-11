import { Tabs } from "expo-router";
import { Home, Dumbbell, Apple, Heart, User } from 'lucide-react-native';

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
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trang chủ",
                    tabBarIcon: () => <Home color="#fff" />,

                }}
            />
            <Tabs.Screen
                name="workout-list"
                options={{
                    title: "Danh sách bài tập",
                    tabBarIcon: () => <Dumbbell color="#fff" />,
                }}
            />
            <Tabs.Screen
                name="(nutrient)"
                options={{
                    title: "Dinh dưỡng",
                    tabBarIcon: () => <Apple color="#fff" />,
                }}
            /><Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: () => <User color="#fff" />,
                }}
            />
        </Tabs>
    );
}