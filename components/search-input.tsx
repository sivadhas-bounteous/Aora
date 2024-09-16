import { View, Text, TextInput, Touchable, Image, Alert } from "react-native";
import React, { FC, useState } from "react";
import { TouchableOpacity } from "react-native";
import { icons } from "@/constants";
import { usePathname, router } from "expo-router";


const SearchInput: FC = ({initialQuery}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState( initialQuery || "");

  return (
    <View className="w-full h-16 px-4 bg-black-100 border-black-200 border-2 rounded-2xl focus:border-secondary-100 items-center flex-row space-x-4">
      <TextInput
        className="mt-0.5 text-white flex-1 font-pregular text-base"
        placeholder="Search for a video topic"
        value={query}
        placeholderTextColor={"#cdcde0"}
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query)
            return Alert.alert(
              "Missing query",
              "Please input something to search results"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
