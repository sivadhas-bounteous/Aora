import { Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white text-3xl  ">
      <Text className="text-3xl">Aora!</Text>
      <StatusBar style="auto"></StatusBar>
      <Link href="/home">Go to Home</Link>
    </View>
  );
};

export default App;
