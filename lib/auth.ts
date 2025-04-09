import { supabase } from './supabase'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  gender: 'male' | 'female' | 'other'
  birthDate: string
  height: number
  weight: number
  goalWeight: number
  goalType: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_health'
}

export interface SignInData {
  email: string
  password: string
}

// Lưu trữ OTP tạm thời (trong thực tế nên lưu vào database)
const otpStore = new Map<string, { otp: string; expiry: number }>();

export async function signUp(data: SignUpData) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) throw authError

    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email: data.email,
        full_name: data.fullName,
        gender: data.gender,
        birth_date: data.birthDate,
        height: data.height,
        weight: data.weight,
        goal_weight: data.goalWeight,
        goal_type: data.goalType,
        daily_calorie_goal: 2000,
      })

    if (profileError) throw profileError

    return { success: true }
  } catch (error) {
    console.error('Error signing up:', error)
    return { success: false, error }
  }
}

export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error

    return { success: true, user: authData.user }
  } catch (error) {
    console.error('Error signing in:', error)
    return { success: false, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error }
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Error getting current user:', error)
    return { success: false, error }
  }
}

// Hàm tạo và gửi OTP
export async function sendOTP(email: string) {
  try {
    // Gửi email với OTP
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false // Không tạo user mới nếu chưa tồn tại
      }
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error };
  }
}

// Hàm xác thực OTP
export async function verifyOTP(email: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email'
    });

    if (error) throw error;

    return { success: true, session: data.session };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error };
  }
}

export async function updateUserPassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating user password:', error);
    return { success: false, error };
  }
}