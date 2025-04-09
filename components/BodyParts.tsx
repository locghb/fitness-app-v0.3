import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ListRenderItemInfo } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Import BodyPart interface và bodyParts array từ constants
import { bodyParts, BodyPart } from '../constants'; // Đảm bảo BodyPart đã được export từ constants.ts
import { LinearGradient } from 'expo-linear-gradient'; // Đảm bảo đã cài đặt expo-linear-gradient
import { useRouter, Router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Interface cho Props của BodyPartCard
interface BodyPartCardProps {
    item: BodyPart;
    router: Router;
    index: number;
}

// Component BodyPartCard
export const BodyPartCard: React.FC<BodyPartCardProps> = ({ item, router, index }) => {
    return (
        <Animated.View entering={FadeInDown.duration(400).delay(index * 200).springify()}>
            <TouchableOpacity
                // Chỉ truyền params cần thiết và serializable
                // onPress={() => router.push({ pathname: '/exercises', params: { name: item.name } })}
                style={styles.cardTouchable}
                className="flex justify-end p-4 mb-4" // NativeWind/Tailwind class
            >
                <Image
                    source={item.image}
                    resizeMode='cover'
                    style={styles.cardImage}
                    className="rounded-[35px] absolute" // NativeWind/Tailwind class
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.cardGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    className="absolute bottom-0 rounded-b-[35px]" // NativeWind/Tailwind class
                />
                <Text
                    style={styles.cardText}
                    className="text-white font-semibold text-center tracking-wide" // NativeWind/Tailwind class
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};


// Component Chính: BodyParts
const BodyParts: React.FC = () => {
    const router: Router = useRouter();

    // Hàm Render Item cho FlatList
    const renderBodyPartItem = ({ item, index }: ListRenderItemInfo<BodyPart>): JSX.Element => {
        return <BodyPartCard router={router} index={index} item={item} />;
    };

    return (
        <View style={styles.container} className="mx-4">
            <Text style={styles.title} className="font-semibold text-neutral-700">
                Exercises
            </Text>

            <FlatList<BodyPart> // Cung cấp type generic cho FlatList
                data={bodyParts}
                numColumns={2}
                keyExtractor={(item) => item.name} // Không cần type ở đây nếu đã cung cấp generic type cho FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
                columnWrapperStyle={styles.listColumnWrapper}
                renderItem={renderBodyPartItem}
            />
        </View>
    );
}

// StyleSheet
const styles = StyleSheet.create({
    container: {
        // marginHorizontal: wp(4) // Tương đương mx-4 nếu bạn không dùng NativeWind
    },
    title: {
        fontSize: hp(3),
        fontWeight: '600', // font-semibold
        color: '#404040'   // text-neutral-700
    },
    listContentContainer: {
        paddingBottom: 50,
        paddingTop: 20,
    },
    listColumnWrapper: {
        justifyContent: 'space-between',
    },
    cardTouchable: {
        width: wp(44),
        height: wp(52),
        // Các style tương ứng className="flex justify-end p-4 mb-4"
        // padding: wp(4), // Ví dụ p-4
        // marginBottom: wp(4) // Ví dụ mb-4
    },
    cardImage: {
        width: wp(44),
        height: wp(52),
        borderRadius: 35, // Tương đương rounded-[35px]
        position: 'absolute',
    },
    cardGradient: {
        width: wp(44),
        height: hp(15),
        position: 'absolute',
        bottom: 0,
        borderBottomLeftRadius: 35, // Tương đương rounded-b-[35px]
        borderBottomRightRadius: 35,
    },
    cardText: {
        fontSize: hp(2.3),
        // Các style tương ứng className="text-white font-semibold text-center tracking-wide"
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        // letterSpacing: 0.5, // Ví dụ cho tracking-wide
    }
});

export default BodyParts;