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
import { useRouter } from "expo-router";
import { sendOTP } from "../../lib/auth";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendOTP(email);

      if (result.success) {
        router.push({
          pathname: "./otp-verification",
          params: { email }
        });
      } else {
        Alert.alert("Lỗi", "Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Quên mật khẩu?</Text>
          <Text style={styles.subtitle}>
            Nhập email của bạn để nhận mã xác thực
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Gửi mã xác thực</Text>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
});