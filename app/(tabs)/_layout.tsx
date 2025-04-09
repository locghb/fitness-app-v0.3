import { Tabs } from "expo-router";
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
                    // tabBarIcon: "home",

                }}
            />
            <Tabs.Screen
                name="workout-list"
                options={{
                    title: "Danh sách bài tập",
                    // tabBarIcon: "list",
                }}
            />
            <Tabs.Screen
                name="nutrient"
                options={{
                    title: "Dinh dưỡng",
                    // tabBarIcon: "user",
                }}
            />
        </Tabs>
    );
}