import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import Config from "../Config";
import { Picker } from "@react-native-picker/picker";

const DetailScreen = ({ route, navigation }) => {
  const item = route.params?.item;

  const [nama, setnama] = useState(item?.nama || "");
  const [kereta, setkereta] = useState(item?.kereta || "");
  const [kendala, setLecture] = useState(item?.kendala || "");
  const [deskripsi, setdeskripsi] = useState(item?.deskripsi || "");
  const [date, setDate] = useState(
    item?.date || new Date().toISOString().slice(0, 19)
  );

  const handleSave = async () => {
    if (!nama || !kereta || !kendala) {
      Alert.alert("Isi semua field");
      return;
    }

    if (deskripsi.length < 20) {
      Alert.alert("Validasi Gagal", "Deskripsi minimal 20 karakter");
      return;
    }

    try {
      if (item) {
        await axios.patch(
          `${Config.BASE_URL}?id=eq.${item.id}`,
          { nama, kereta, kendala, deskripsi, date, status: true },
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
          { nama, kereta, kendala, deskripsi, date, status: true },
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {item ? "Edit Data" : "Tambah Data Laporan"}
      </Text>

      <TextInput
        placeholder="Nama Pelapor"
        value={nama}
        onChangeText={setnama}
        style={styles.input}
      />

      <TextInput
        placeholder="ID Kereta"
        value={kereta}
        onChangeText={setkereta}
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={kendala}
          onValueChange={(itemValue) => setLecture(itemValue)}
        >
          <Picker.Item label="Pilih Kendala" value="" />
          <Picker.Item label="Mesin Rusak" value="Mesin Rusak" />
          <Picker.Item label="Rem Bermasalah" value="Rem Bermasalah" />
        </Picker>
      </View>

      <TextInput
        placeholder="Deskripsi"
        value={deskripsi}
        onChangeText={setdeskripsi}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Kirim</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});