import { View, Text, Image, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native'; // Thêm FlatList, ListRenderItemInfo
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, Router } from 'expo-router'; // Import useRouter nếu BodyPartCard cần

// Import trực tiếp dữ liệu và types
import { bodyParts, BodyPart } from '../../constants'; // Đảm bảo đường dẫn đúng và BodyPart được export
// Import component con (hoặc logic render của nó)
import ImageSlider from '../../components/ImageSlider';
// Import BodyPartCard (hoặc tạo nó trực tiếp ở đây nếu đơn giản)
import { BodyPartCard } from '../../components/BodyParts'; // <<< Giả sử BodyPartCard được export từ BodyParts.tsx

// --- Component Chính: WorkoutListScreen ---
const WorkoutListScreen: React.FC = () => {
  const router: Router = useRouter(); // Lấy router nếu BodyPartCard cần

  // --- Header Component cho FlatList ---
  const renderListHeader = () => (
    <>
      {/* Header: Punchline và Avatar */}
      <View style={styles.headerContainer} className="flex-row justify-between items-center mx-5 mb-5">
        {/* Phần Text */}
        <View className="space-y-2">
          <Text style={styles.headerText} className="font-bold tracking-wider text-neutral-700">
            READY TO
          </Text>
          <Text style={[styles.headerText, styles.headerTextHighlight]} className="font-bold tracking-wider text-rose-500">
            WORKOUT
          </Text>
        </View>
        {/* Phần Avatar và Notification */}
        <View style={styles.avatarContainer} className="flex justify-center items-center space-y-2">
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.avatarImage}
            className="rounded-full"
          />
          <View
            style={styles.notificationIconContainer}
            className="bg-neutral-200 rounded-full flex justify-center items-center border-[3px] border-neutral-300"
          >
            <Ionicons name="notifications" size={hp(3)} color="gray" />
          </View>
        </View>
      </View>

      {/* Image Slider */}
      <View style={styles.sliderContainer} className="mb-5">
        <ImageSlider />
      </View>

      {/* Tiêu đề cho danh sách Body Parts */}
      <View style={styles.bodyPartsTitleContainer} className="mx-4 mb-4">
         <Text style={styles.bodyPartsTitleText} className="font-semibold text-neutral-700">
            Exercises
         </Text>
      </View>
    </>
  );

  // --- Render Item cho danh sách Body Parts ---
  const renderBodyPartItem = ({ item, index }: ListRenderItemInfo<BodyPart>): JSX.Element => {
    // Truyền router và các props cần thiết cho BodyPartCard
    // Lưu ý: Đảm bảo BodyPartCard được import hoặc định nghĩa đúng
    return <BodyPartCard item={item} index={index} router={router} />;
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      <FlatList<BodyPart> // Sử dụng FlatList làm gốc
        data={bodyParts}
        renderItem={renderBodyPartItem}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={renderListHeader} // Render header và slider ở trên cùng
        numColumns={2} // Hiển thị 2 cột
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer} // Style cho nội dung bên trong FlatList
        columnWrapperStyle={styles.listColumnWrapper} // Style để căn chỉnh 2 cột
      />
    </SafeAreaView>
  );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  // Styles cho Header Component bên trong FlatList
  headerContainer: {
    marginTop: hp(1), // Thêm khoảng cách trên cùng nếu cần (thay vì space-y)
    // className="flex-row justify-between items-center mx-5 mb-5"
    marginHorizontal: wp(5),
    marginBottom: hp(2.5) // mb-5 (ví dụ)
  },
  headerText: {
    fontSize: hp(4.5),
    // className="font-bold tracking-wider text-neutral-700"
  },
  headerTextHighlight: {
    color: '#f43f5e', // text-rose-500
  },
  avatarContainer: {
     // className="flex justify-center items-center space-y-2"
  },
  avatarImage: {
    height: hp(6),
    width: hp(6),
  },
  notificationIconContainer: {
    height: hp(5.5),
    width: hp(5.5),
  },
  sliderContainer: {
    // className="mb-5"
    marginBottom: hp(2.5) // mb-5 (ví dụ)
  },
  bodyPartsTitleContainer:{
    // className="mx-4 mb-4"
    marginHorizontal: wp(4),
    marginBottom: hp(2) // mb-4 (ví dụ)
  },
  bodyPartsTitleText: {
    fontSize: hp(3),
    // className="font-semibold text-neutral-700"
    fontWeight: '600',
    color: '#404040'
  },
  // Styles cho FlatList
  listContentContainer: {
    paddingHorizontal: wp(4), // Padding ngang cho các item trong list
    paddingBottom: hp(4), // Padding dưới cùng cho list
  },
  listColumnWrapper: {
    justifyContent: 'space-between',
  }
});

export default WorkoutListScreen;