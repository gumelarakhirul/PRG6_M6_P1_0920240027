import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Config from "../Config";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  // 🔹 ambil username dari AsyncStorage
  const getUser = async () => {
    const username = await AsyncStorage.getItem("user");
    if (username) setUser(username);
  };

  useEffect(() => {
    getUser();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(Config.BASE_URL, {
        headers: {
          apikey: Config.API_KEY,
          Authorization: `Bearer ${Config.API_KEY}`,
        },
      });
      setData(res.data);
    } catch {
      Alert.alert("Error", "Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AUTO REFRESH (FIX BUG)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Hapus", "Yakin?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          try {
            await axios.delete(`${Config.BASE_URL}?id=eq.${id}`, {
              headers: {
                apikey: Config.API_KEY,
                Authorization: `Bearer ${Config.API_KEY}`,
              },
            });
            fetchData();
          } catch {
            Alert.alert("Error", "Gagal hapus");
          }
        },
      },
    ]);
  };

  // 🔴 LOGOUT
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 HEADER */}
      <View style={{ padding: 15, backgroundColor: "#eee" }}>
        <Text>Halo, {user}</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "red" }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 LIST DATA */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detail", { item })}
            >
              <Text>{item.course}</Text>
              <Text>{item.room}</Text>
              <Text>{item.lecture}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔹 BUTTON TAMBAH */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail")}
        style={{
          backgroundColor: "blue",
          padding: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Tambah Data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListScreen;