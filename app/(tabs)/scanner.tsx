import { StyleSheet, View, Text } from "react-native";
import { ThemedView } from "@/components/themed-view";

export default function ScannerScreen() {
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>QR Code Scanner</Text>
      <Text style={styles.subtitle}>Bu yerda QR kod skaneri bo'ladi</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
