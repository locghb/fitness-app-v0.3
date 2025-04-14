import { Alert } from "react-native";
import { supabase } from "./supabase";
import * as Linking from "expo-linking";
import { User } from "@supabase/supabase-js";

interface ExtendedUser extends User {
  email_confirmed_at?: string;
}

interface AuthResponse {
  user: ExtendedUser | null;
  session?: any | null;
  message?: string;
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResponse | null> {
  try {
    // Đăng ký với Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: Linking.createURL('') },
    });
    if (error) {
      console.error('Auth error:', error);
      throw new Error(error.message);
    }

    // Lưu thông tin vào public.users
    if (data.user) {
      const { error: dbError } = await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        name: name || 'New User', // Dùng name từ input, mặc định nếu không có
        birth_date: null, // Có thể cập nhật sau
      });
      if (dbError) {
        console.error('Database insert error:', JSON.stringify(dbError, null, 2));
        throw new Error(`Database error saving new user: ${dbError.message}`);
      }
    }

    return { user: data.user, message: 'Check your email for verification link!' };
  } catch (error: any) {
    console.error('SignUp error:', JSON.stringify(error, null, 2));
    Alert.alert('Error', error.message);
    return null;
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return { user: data.user, session: data.session };
  } catch (error: any) {
    Alert.alert("Error", error.message);
    return null;
  }
}

export async function signOut(): Promise<AuthResponse | null> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return { user: null, message: "Signed out successfully!" };
  } catch (error: any) {
    Alert.alert("Error", error.message);
    return null;
  }
}
export async function getCurrentUser(): Promise<any | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data.user;
  } catch (error) {
    return null;
  }
}
export async function requestPasswordReset(
  email: string
): Promise<AuthResponse | null> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL(""),
    });
    if (error) throw new Error(error.message);
    return { user: null, message: "Check your email for OTP!" };
  } catch (error: any) {
    Alert.alert("Error", error.message);
    return null;
  }
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<AuthResponse | null> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) throw new Error(error.message);
    return {
      user: null,
      session: data.session,
      message: "OTP verified! Ready to reset password.",
    };
  } catch (error: any) {
    Alert.alert("Error", error.message);
    return null;
  }
}

export async function resetPassword(
  newPassword: string
): Promise<AuthResponse | null> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
    return { user: null, message: "Password updated successfully!" };
  } catch (error: any) {
    Alert.alert("Error", error.message);
    return null;
  }
}
