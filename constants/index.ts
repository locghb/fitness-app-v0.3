import { ImageSourcePropType } from "react-native";

export const rapidApiKey: string =
  "37b85982cemsh3bc946f6e8d5f52p16c47ejsnc356d000854e";

export const sliderImages: ImageSourcePropType[] = [
  require("../assets/images/slide1.png"),
  require("../assets/images/slide3.png"),
  require("../assets/images/slide2.png"),
  require("../assets/images/slide4.png"),
  require("../assets/images/slide5.png"),
];

// Định nghĩa interface cho các phần cơ thể
export interface BodyPart {
  name: string;
  image: ImageSourcePropType;
}

export const bodyParts: BodyPart[] = [
  {
    name: "back",
    image: require("../assets/images/back.png"),
  },
  {
    name: "cardio",
    image: require("../assets/images/cardio.png"),
  },
  {
    name: "lower arms",
    image: require("../assets/images/lowerArms.png"),
  },
  {
    name: "lower legs",
    image: require("../assets/images/lowerLegs.png"),
  },
  {
    name: "chest",
    image: require("../assets/images/chest.png"),
  },
  {
    name: "neck",
    image: require("../assets/images/neck.png"),
  },
  {
    name: "shoulders",
    image: require("../assets/images/shoulders.png"),
  },
  {
    name: "upper arms",
    image: require("../assets/images/upperArms.png"),
  },
  {
    name: "upper legs",
    image: require("../assets/images/upperLegs.png"),
  },
  {
    name: "waist",
    image: require("../assets/images/waist.png"),
  },
];
