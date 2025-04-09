// screens/auth/ResetPasswordConfirmScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { updateUserPassword } from "../../lib/auth";

export default function ResetPasswordConfirmScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserPassword(newPassword);
      if (result.success) {
        Alert.alert("Thành công", "Đổi mật khẩu thành công", [
          {
            text: "OK",
            onPress: () => router.push("./index"),
          },
        ]);
      } else {
        Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đổi mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Đổi mật khẩu mới</Text>
          <Text style={styles.subtitle}>
            Nhập mật khẩu mới cho tài khoản của bạn
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Xác nhận</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Hàm updateUserPassword giữ nguyên như bạn đã cung cấp
// export async function updateUserPassword(newPassword: string) { ... }