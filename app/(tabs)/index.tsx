import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getCurrentUser, signOut } from "../../lib/auth";
import { Bell, User as User2 } from 'lucide-react-native';

export default function HomeScreen() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { userName } = useLocalSearchParams(); // Lấy tên người dùng từ params

    const handleProfile = async()=>{
        router.replace("/(tabs)/profile/userprofile")
    }
    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const result = await getCurrentUser();
            if (result.success && result.user) {
                setUser(result.user);
            } else {
                // Nếu không có người dùng đăng nhập, chuyển hướng đến trang đăng nhập
                router.replace("/(auth)");
            }
        } catch (error) {
            console.error("Error checking user:", error);
            router.replace("/(auth)");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToWorkout = () => {
        // router.push("./workout-list");
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.greeting}>
                    <Text style={styles.hello}>Xin chào,</Text>
                    <Text style={styles.name}>{userName || user?.fullName || "Người dùng"}</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Bell size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleProfile}>
                        <User2 size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsCard}>
                <Text style={styles.cardTitle}>Hoạt động hàng ngày</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Bước đi</Text>
                        <Text style={styles.statValue}>8,000</Text>
                        <Text style={styles.statUnit}>bước</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Calorie</Text>
                        <Text style={styles.statValue}>300</Text>
                        <Text style={styles.statUnit}>kcal</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Nhịp tim</Text>
                        <Text style={styles.statValue}>77</Text>
                        <Text style={styles.statUnit}>bpm</Text>
                    </View>
                </View>
            </View>

            <View style={styles.workoutCard}>
                <Text style={styles.workoutTitle}>Bài tập toàn thân</Text>
                <Text style={styles.workoutSubtitle}>5 bài tập</Text>
                <TouchableOpacity style={styles.startButton} onPress={handleNavigateToWorkout}>
                    <Text style={styles.startButtonText}>Bắt đầu</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    greeting: {
        flex: 1,
    },
    hello: {
        fontSize: 16,
        color: '#6B7280',
    },
    name: {
        fontSize: 24,
        color: '#1F2937',
        marginTop: 4,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsCard: {
        margin: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        color: '#1F2937',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        color: '#1F2937',
    },
    statUnit: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    workoutCard: {
        margin: 20,
        padding: 20,
        backgroundColor: '#F97316',
        borderRadius: 16,
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    workoutTitle: {
        fontSize: 20,
        color: '#fff',
    },
    workoutSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
        marginTop: 4,
    },
    startButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 20,
    },
    startButtonText: {
        fontSize: 16,
        color: '#F97316',
    },
    logoutButton: {
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
}); 