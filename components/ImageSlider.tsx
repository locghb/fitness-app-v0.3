import { View, StyleSheet, ImageSourcePropType, Dimensions, Image } from 'react-native'; // Thêm Dimensions và Image
import React from 'react';
// Import thư viện mới
import Carousel from 'react-native-reanimated-carousel';
import { sliderImages } from '../constants/index'; // Đảm bảo đường dẫn đúng
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Lấy chiều rộng màn hình
const { width: screenWidth } = Dimensions.get('window');

// --- Interface cho Item (giữ nguyên) ---
interface CarouselRenderItemInfo {
  item: ImageSourcePropType;
  index: number;
}

const ImageSlider: React.FC = () => {
  // Chiều rộng của mỗi item trong carousel
  const itemWidth = wp(100) - 70;
  // Chiều cao mong muốn của item
  const itemHeight = hp(25);

  // --- Hàm Render Item ---
  // Bỏ ParallaxImage, sử dụng Image thông thường
  const renderItem = ({ item, index }: CarouselRenderItemInfo): JSX.Element => {
    return (
      <View style={[styles.itemContainer, { width: itemWidth, height: itemHeight }]} key={index}>
        <Image
          source={item}
          style={styles.itemImage}
          resizeMode="cover" // Hoặc 'contain' tùy ý bạn
        />
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop // Tương đương loop={true}
        width={itemWidth} // Chiều rộng của MỘT item hiển thị
        height={itemHeight} // Chiều cao của carousel
        autoPlay={true}
        autoPlayInterval={4000}
        data={sliderImages}
        // scrollAnimationDuration={1000} // Tốc độ chuyển slide (tùy chọn)
        // onSnapToItem={(index) => console.log('current index:', index)} // Callback khi chuyển item
        renderItem={renderItem}
        // Các props khác của reanimated-carousel (xem docs để biết thêm)
        // mode="parallax" // Có thể thử nghiệm mode parallax nếu muốn hiệu ứng tương tự
        // modeConfig={{
        //   parallaxScrollingScale: 0.9,
        //   parallaxScrollingOffset: 50,
        // }}
        // PanGestureHandlerProps={{ activeOffsetX: [-10, 10] }} // Giảm độ nhạy khi vuốt (tùy chọn)
        style={{ width: screenWidth }} // Carousel chiếm toàn bộ chiều rộng màn hình để tính toán đúng
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center', // Căn giữa carousel nếu nó không chiếm toàn bộ màn hình
  },
  itemContainer: {
    // width và height được set inline hoặc từ biến
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white', // Thêm nền nếu cần
    borderRadius: 30, // Bo góc cho container
    overflow: 'hidden', // Đảm bảo ảnh không tràn ra ngoài border radius
     // Thêm shadow nếu muốn hiệu ứng nổi
     shadowColor: "#000",
     shadowOffset: {
         width: 0,
         height: 2,
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    // borderRadius: 30, // Đã có overflow: 'hidden' ở container
  },
});

export default ImageSlider;