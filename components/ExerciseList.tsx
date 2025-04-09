import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItemInfo } from 'react-native';
import React from 'react';
import { useRouter, Router } from 'expo-router'; // Import Router type
import { Image } from 'expo-image'; // expo-image thường đã có types
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';

// --- Định nghĩa Type cho một Exercise Item ---
// (Bạn nên đặt type này ở một file dùng chung nếu sử dụng ở nhiều nơi)
interface Exercise {
  // Bắt buộc dựa trên cách sử dụng trong code:
  name: string;
  gifUrl: string;
  // Thêm các thuộc tính khác nếu có và nếu chúng được truyền qua params
  // Ví dụ: id?: string; bodyPart?: string; target?: string; equipment?: string;
  // Sử dụng [key: string]: any; nếu bạn không chắc chắn tất cả các thuộc tính
  // nhưng hãy cẩn thận vì nó làm giảm tính an toàn của type.
  [key: string]: any; // Cho phép truyền bất kỳ thuộc tính nào qua params (cần thận trọng)
}

// --- Interface cho Props của ExerciseList ---
interface ExerciseListProps {
  data: Exercise[]; // Prop 'data' là một mảng các Exercise
}

// --- Interface cho Props của ExerciseCard ---
interface ExerciseCardProps {
  item: Exercise;
  router: Router; // Sử dụng type Router
  index: number;
}

// --- Component ExerciseCard ---
const ExerciseCard: React.FC<ExerciseCardProps> = ({ item, router, index }) => {
  // Lưu ý: Truyền cả object 'item' qua params có thể gây lỗi nếu 'item' chứa
  // các giá trị không thể serialize (functions, Date objects phức tạp,...).
  // Cách tốt hơn là chỉ truyền ID hoặc các thông tin cần thiết.
  // Tuy nhiên, để giữ nguyên logic gốc, chúng ta vẫn truyền 'item'.
  const handlePress = () => {
    // router.push({ pathname: '/exerciseDetails', params: item });
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 200).springify()}>
      <TouchableOpacity onPress={handlePress} style={styles.cardTouchable} className="flex py-3 space-y-2">
        {/* Container cho ảnh với shadow */}
        <View style={styles.imageContainer} className="bg-white shadow rounded-[25px]">
          <Image
            source={{ uri: item.gifUrl }}
            contentFit='cover'
            style={styles.cardImage}
            className="rounded-[25px]" // className cho border radius
            transition={200} // Thêm hiệu ứng transition mượt mà cho expo-image
          />
        </View>

        {/* Tên bài tập */}
        <Text
          style={styles.cardText}
          className="text-neutral-700 font-semibold ml-1 tracking-wide" // className cho styling text
          numberOfLines={2} // Giới hạn 2 dòng để tránh quá dài
        >
          {item.name}
          {/* Logic cắt chuỗi đã được xử lý bằng numberOfLines, nhưng có thể giữ lại nếu muốn */}
          {/* {item.name?.length > 20 ? item.name.slice(0, 20) + '...' : item.name} */}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Component Chính: ExerciseList ---
const ExerciseList: React.FC<ExerciseListProps> = ({ data }) => {
  const router: Router = useRouter(); // Thêm type Router

  // --- Hàm Render Item cho FlatList ---
  const renderExerciseItem = ({ item, index }: ListRenderItemInfo<Exercise>): JSX.Element => {
    return <ExerciseCard router={router} index={index} item={item} />;
  };

  return (
    <View style={styles.listContainer}>
      <FlatList<Exercise> // Cung cấp type generic cho FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.name + item.gifUrl} // Tạo key duy nhất hơn (phòng trường hợp tên trùng)
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={styles.listColumnWrapper}
        renderItem={renderExerciseItem}
      />
    </View>
  );
}

// --- StyleSheet ---
const styles = StyleSheet.create({
  listContainer: {
    // Thêm style nếu cần
  },
  listContentContainer: {
    paddingBottom: 60,
    paddingTop: 20,
    paddingHorizontal: wp(4), // Thêm padding ngang để tránh sát viền
  },
  listColumnWrapper: {
    justifyContent: 'space-between',
  },
  cardTouchable: {
    // className="flex py-3 space-y-2"
    width: wp(44), // Đảm bảo chiều rộng để vừa 2 cột với khoảng cách
    marginBottom: hp(2), // Thêm khoảng cách dưới
  },
  imageContainer: {
    // className="bg-white shadow rounded-[25px]"
    backgroundColor: 'white',
    borderRadius: 25,
    // Shadow styles (cần điều chỉnh cho phù hợp)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardImage: {
    width: '100%', // Chiếm hết chiều rộng container
    height: wp(52), // Giữ nguyên tỉ lệ chiều cao
    // borderRadius: 25, // className đã xử lý
  },
  cardText: {
    fontSize: hp(1.7),
    // className="text-neutral-700 font-semibold ml-1 tracking-wide"
    color: '#404040', // text-neutral-700
    fontWeight: '600', // font-semibold
    marginLeft: wp(1), // ml-1
    // letterSpacing: 0.5, // tracking-wide (tùy chỉnh)
  }
});

export default ExerciseList;