import { Alert, Image, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setisSubmitting] = useState(false);
  const {setUser, setIsLogged} = useGlobalContext();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setisSubmitting(true);

    try {
      const result = await signIn(form.email , form.password);
      const user = getCurrentUser();
      setUser(user);
      setIsLogged(true);

      router.replace("/home");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setisSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-white text-2xl mt-10 font-psemibold">
            Sign in
          </Text>
          <FormField
            value={form.email}
            title="Email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder={""}
          />

          <FormField
            value={form.password}
            title="Password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder={""}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles={""}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Dont have an account?</Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary-100">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
