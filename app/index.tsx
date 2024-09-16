import { Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "@/components/custom-button";
import { useGlobalContext } from "@/context/GlobalProvider";

const App = () => {

  const {isLogged, loading} = useGlobalContext();

  if(!loading && isLogged) return (<Redirect href={"/home"} ></Redirect>)
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[130px] h-[84px]"
          />

          <Image
            source={images.cards}
            resizeMode="contain"
            className="max-w-[380px] w-full h-[300px]"
          />

          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-white text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>{" "}
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            ></Image>
          </View>

          <Text className="text-center font-pregular text-gray-100 mt-7 text-sm">
            Where creativity neets innvoation : embark a journey of limitless
            exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => { router.push('/sign-in')}}
            containerStyles="w-full mt-7"
            isLoading={false}
            textStyles={""}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light"></StatusBar>
    </SafeAreaView>
  );
};

export default App;
