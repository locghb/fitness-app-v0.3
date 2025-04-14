import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, Image } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCurrentUser, signOut } from '@/lib/auth';
import * as ImagePicker from 'expo-image-picker';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const UserProfileScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [gender, setGender] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

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


  const handleProfileClick = () => {
    setShowPersonalForm(true);
  };
  const handleSave = () => {
    setShowPersonalForm(false);
    alert('Information saved!');
  };
  const handleBack = () =>{
    setShowPersonalForm(false);
  }
  const handleAchievementScreen = async()=>{
    router.replace("/(tabs)/profile/achievement");
  }
  const handleHistoryScreen = async()=>{
    router.replace("/(tabs)/profile/history");
  }
  const handleUpgrade = async()=>{
    router.replace("/(tabs)/exercises")
  }
  const handleLogout = async () => {
      try {
          const result = await signOut();
          if (result.success) {
              router.replace("/(auth)");
          }
      } catch (error) {
          console.error("Error signing out:", error);
      }
  };
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    });
    
    if (!result.canceled) {
      setProfileImage(result.uri);
    }
    };
    
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={require("../../../assets/images/user.png")} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.name}>{user?.fullName || "Người dùng"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.plan}>Beginner</Text>
        <TouchableOpacity style={styles.subscribeButton} onPress={(handleUpgrade)}>
          <FontAwesome name="star" size={16} color="black" />
          <Text style={styles.subscribeText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>
      {!showPersonalForm ? (
        <View style={styles.menu}>
          <MenuItem icon="person" text="Profile" onPress={handleProfileClick} />
          <MenuItem icon="history" text="History" onPress={(handleHistoryScreen)} />
          <MenuItem icon="bar-chart" text="Statistic" onPress={() => {}}/>
          <MenuItem icon="tag" text="Achievement" onPress={(handleAchievementScreen)} />
          <MenuItem icon="logout" text="Log out" onPress={(handleLogout)} />
        </View>
      ) : (
        <PersonalInfoForm onBack = {handleBack} onSave={handleSave} userprofile={user} gender={gender} setGender={setGender} date={date} setDate={setDate} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} />
      )}
    </View>
  );
};

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <MaterialIcons name={icon} size={24} color="black" />
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons name="chevron-forward" size={24} color="black" />
  </TouchableOpacity>
);

const PersonalInfoForm = ({ onSave, userprofile, gender, setGender, date, setDate, showDatePicker, setShowDatePicker, onBack}) => {
  const onDateChange = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setShowDatePicker(false);
  setDate(currentDate);
  };

 return (
 <View style={styles.form}>
  <Text style={styles.formTitle}>Personal Information</Text>
  <TextInput style={styles.input} placeholder={userprofile?.fullName || "Người dùng"} />
  <TextInput style={styles.input} placeholder={userprofile?.email} keyboardType="email-address" />
  <Text style={styles.label}>Giới tính:</Text>
  <Picker
  selectedValue={gender}
  onValueChange={(itemValue) => setGender(itemValue)}
  style={styles.picker}
  >
      <Picker.Item label={userprofile?.gender || "Chọn giới tính"} value="" />
      <Picker.Item label="Male" value="male" />
      <Picker.Item label="Female" value="female" />
  </Picker>
  <Text style={styles.label}>Sinh nhật:</Text>
  <Button title="Sinh nhật" onPress={() => setShowDatePicker(true)} />
  {showDatePicker && (
  <DateTimePicker
    value={date}
    mode="date"
    display="default"
    onChange={onDateChange}
  />
  )}
  <Text>Sinh nhật hiện tại: {userprofile?.birthDate || date.toDateString()}</Text>
  <View style={styles.buttonContainer}>
        <Button title="Back" onPress={onBack} />
        <Button title="Save" onPress={onSave} />
      </View>
 </View>
 );
};
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D9D9D9',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  plan: {
    fontSize: 14,
    color: 'gray',
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  subscribeText: {
    marginLeft: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  menu: {
    margin: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#D9D8D7",
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  
label: {
   fontSize: 18,
   marginBottom: 10,
   },
picker: {
   height: 50,
   width: '100%',
   marginBottom: 20,
   },
buttonContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   marginTop: 20,
  },
});

export default UserProfileScreen;