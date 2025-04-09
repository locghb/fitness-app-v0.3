import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { signIn } from "../../lib/auth";

const index = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn({ email, password });

      if (result.success) {
        // Chuyển hướng đến trang chủ
        router.replace("./(tabs)");
      } else {
        Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegister = () => {
    router.push("/register");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Chào mừng</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default index

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
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});