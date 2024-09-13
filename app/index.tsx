import { Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white  ">
      <Text className="text-3xl">Aora!</Text>
      <StatusBar style="auto"></StatusBar>
      <Link href="/profile">Go to profile</Link>
    </View>
  );
};

export default App;
