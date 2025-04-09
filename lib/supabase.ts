import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const storage = Platform.OS === 'web' 
  ? {
      getItem: (key: string) => {
        try {
          const itemStr = localStorage.getItem(key)
          if (!itemStr) {
            return null
          }
          const item = JSON.parse(itemStr)
          const now = new Date()
          if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
          }
          return item.value
        } catch (err) {
          return null
        }
      },
      setItem: (key: string, value: string) => {
        try {
          const item = {
            value: value,
            expiry: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
          }
          localStorage.setItem(key, JSON.stringify(item))
        } catch (err) {
          console.error('Error saving to localStorage', err)
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key)
        } catch (err) {
          console.error('Error removing from localStorage', err)
        }
      },
    }
  : AsyncStorage

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})