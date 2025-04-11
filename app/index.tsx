import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

interface OnboardingItem {
  id: number;
  title: string;
  description: string;
  image: any; 
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: 'Tập luyện theo nhu cầu',
    description: 'Các bài tập được thiết kế phù hợp với mục tiêu và thể trạng của bạn',
    image: require('../assets/onboarding-1.png'),
  },
  {
    id: 2,
    title: 'Theo dõi dinh dưỡng',
    description: 'Ghi chép và theo dõi chế độ ăn uống hàng ngày của bạn',
    image: require('../assets/onboarding-2.png'),
  },
  {
    id: 3,
    title: 'Cải thiện sức khỏe',
    description: 'Đạt được mục tiêu sức khỏe và thể hình của bạn một cách hiệu quả',
    image: require('../assets/onboarding-3.png'),
  },
]; 

const index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < onboardingData.length) {
      setCurrentIndex(index);
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex === onboardingData.length - 1) {
      router.push("./(auth)");
    } else {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    router.push("./(auth)");
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    return (
      <View style={[styles.slide, { width, height }]}>
        <View style={[styles.imageWrapper, { 
          width: width * 0.72,
          height: height * 0.5,
        }]}>
          <Image 
            source={item.image} 
            style={[styles.image, { 
              width: '100%',
              height: '100%',
            }]} 
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index >= 0 && index < onboardingData.length) {
      setCurrentIndex(index);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index >= 0 && index < onboardingData.length) {
      setCurrentIndex(index);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Bỏ qua</Text>
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        <View style={styles.bottomContainer}>
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToIndex(index)}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 40,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#000',
    width: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
}); 