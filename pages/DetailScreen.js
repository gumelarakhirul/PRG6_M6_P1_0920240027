import React, { useState } from "react";
import { View, TextInput, Alert, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import Config from "../Config";

const DetailScreen = ({ route, navigation }) => {
  const item = route.params?.item;

  const [course, setCourse] = useState(item?.course || "");
  const [room, setRoom] = useState(item?.room || "");
  const [lecture, setLecture] = useState(item?.lecture || "");
  const [date, setDate] = useState(
    item?.date || new Date().toISOString().slice(0, 19)
  );

  const handleSave = async () => {
    if (!course || !room || !lecture) {
      Alert.alert("Isi semua field");
      return;
    }

    try {
      if (item) {
        await axios.patch(
          `${Config.BASE_URL}?id=eq.${item.id}`,
          { course, room, lecture, date, status: true },
          {
            headers: {
              apikey: Config.API_KEY,
              Authorization: `Bearer ${Config.API_KEY}`,
            },
          }
        );
      } else {
        await axios.post(
          Config.BASE_URL,
          { course, room, lecture, date, status: true },
          {
            headers: {
              apikey: Config.API_KEY,
              Authorization: `Bearer ${Config.API_KEY}`,
            },
          }
        );
      }

      Alert.alert("Berhasil");
      navigation.goBack();
    } catch {
      Alert.alert("Gagal");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{item ? "Edit" : "Tambah"}</Text>

      <TextInput placeholder="Course" value={course} onChangeText={setCourse} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Room" value={room} onChangeText={setRoom} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Lecture" value={lecture} onChangeText={setLecture} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Date" value={date} onChangeText={setDate} style={{ borderWidth: 1, marginBottom: 10 }} />

      <TouchableOpacity onPress={handleSave} style={{ backgroundColor: "blue", padding: 10 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailScreen;