import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedView } from "@/components/themed-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.link}>
        <MaterialIcons name="account-circle" size={35} color="#20d05b" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 15,
    borderRadius: 25,
    justifyContent: "center",
    marginTop: 40,
    padding: 15,
  },
  link: {
    alignSelf: "flex-end",
  },
});
