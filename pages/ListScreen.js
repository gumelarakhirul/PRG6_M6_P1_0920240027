import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
 FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
 StyleSheet,
} from "react-native";
import axios from "axios";
import Config from "../Config";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  const getUser = async () => {
    const username = await AsyncStorage.getItem("user");

    if (username) {
      setUser(username);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const fetchData = async () => {
    setLoading(true);
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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Hapus Data", "Yakin ingin menghapus data?", [
      {
        text: "Batal",
      },
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
            Alert.alert("Error", "Gagal hapus data");
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  const getKendalaColor = (kendala) => {
    switch (kendala) {
      case "Mesin Rusak":
        return "#dc3545";

      case "Rem Bermasalah":
        return "#0d6efd";

      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Monitoring Komplain Layanan Kereta Api
        </Text>
      </View>

      <View style={styles.userBox}>
        <Text style={styles.userText}>Halo, {user}</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Form Laporan", { item })
            }
          >
            <Text style={styles.nama}>{item.nama}</Text>

            <Text style={styles.label}>
              Kereta :
              <Text style={styles.value}> {item.kereta}</Text>
            </Text>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Kategori Kendala :</Text>

              <Text
                style={[
                  styles.kendalaBadge,
                  {
                    backgroundColor: getKendalaColor(item.kendala),
                  },
                ]}
              >
                {item.kendala}
              </Text>
            </View>

            <Text style={[styles.label, { marginTop: 8 }]}>
              Deskripsi :
              <Text style={styles.value}> {item.deskripsi}</Text>
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Form Laporan")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Tambah Data +</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    backgroundColor: "#00bfff",
    paddingVertical: 18,
    paddingHorizontal: 15,
    alignItems: "center",
    elevation: 3,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  userBox: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  userText: {
    fontSize: 16,
    fontWeight: "600",
  },

  logout: {
    color: "red",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  nama: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },

  label: {
    fontWeight: "bold",
    color: "#333",
  },

  value: {
    fontWeight: "normal",
    color: "#555",
  },

  kendalaBadge: {
    marginTop: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "bold",
    overflow: "hidden",
  },

  deleteButton: {
    marginTop: 15,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#007bff",
    padding: 16,
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});