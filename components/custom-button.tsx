import { View, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";

type CustomButtonProp = {
  title: string;
  handlePress: () => void;
  containerStyles: string;
  isLoading: boolean;
  textStyles: string;
};
const CustomButton: FC<CustomButtonProp> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      } `}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles} `}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
