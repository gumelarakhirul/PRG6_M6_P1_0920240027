import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");

  // 🔥 AUTO LOGIN
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        navigation.replace("List");
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!username) {
      Alert.alert("Masukkan username");
      return;
    }

    try {
      await AsyncStorage.setItem("user", username);
      navigation.replace("List");
    } catch (e) {
      Alert.alert("Gagal login");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "blue", padding: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;