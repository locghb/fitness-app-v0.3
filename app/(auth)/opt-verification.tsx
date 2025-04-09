import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOTP, sendOTP } from '../../lib/auth';

export default function OTPVerificationScreen() {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const { email } = useLocalSearchParams();
  
  // Refs cho 6 ô input
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOTPChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = text;
      setOTP(newOTP);

      // Tự động focus vào ô tiếp theo
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOTP = [...otp];
      newOTP[index - 1] = '';
      setOTP(newOTP);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const startCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 số');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(email as string, otpString);
      if (result.success) {
        router.push({
          pathname: './reset-password',
          params: { email }
        });
      } else {
        Alert.alert('Lỗi', 'Mã xác thực không đúng hoặc đã hết hạn');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xác thực mã');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await sendOTP(email as string);
      if (result.success) {
        Alert.alert('Thành công', 'Mã xác thực mới đã được gửi');
        startCountdown();
      } else {
        Alert.alert('Lỗi', 'Không thể gửi lại mã xác thực');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi lại mã');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Xác thực OTP</Text>
          <Text style={styles.subtitle}>
            Nhập mã xác thực 6 số đã được gửi đến email của bạn
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Xác nhận</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={resendDisabled}
          >
            <Text
              style={[
                styles.resendText,
                resendDisabled && styles.resendTextDisabled,
              ]}
            >
              {resendDisabled
                ? `Gửi lại sau ${countdown}s`
                : 'Gửi lại mã xác thực'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#999',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
}); 