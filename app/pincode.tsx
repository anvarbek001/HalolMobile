import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const PinCode = () => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    // Faqat raqamlarni qoldirish
    const cleanNumber = text.replace(/[^0-9]/g, "");
    const newPin = [...pin];
    newPin[index] = cleanNumber;
    setPin(newPin);

    if (cleanNumber.length !== 0 && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "") && index === 3) {
      Keyboard.dismiss();

      const pinString = newPin.join("");

      savePinCode(pinString);
      console.log("PIN:", pinString);
    }
  };

  const savePinCode = async (fullPin: any) => {
    try {
      await SecureStore.setItemAsync("user_pincode", fullPin);
      console.log("PIN-kod muvaffaqiyatli saqlandi!");
      router.replace("/(tabs)/homescreen");
    } catch (error) {
      console.error("Saqlashda xato:", error);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && pin[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.title}>Xavfsizlik kodi</Text>
        <Text style={styles.subtitle}>
          Ilovaga kirish uchun 4 xonali PIN kodni kiriting
        </Text>
      </View>

      <View style={styles.container}>
        {pin.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.inputContainer,
              focusedIndex === index && styles.inputFocused,
              digit !== "" && styles.inputFilled,
            ]}
          >
            <TextInput
              ref={(el) => {
                inputs.current[index] = el;
              }}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              value={digit}
              secureTextEntry={true}
              cursorColor="#20d05b" // Android uchun fokus rangi
              selectionColor="transparent"
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#f4faf6", // Sizning ilovangiz fon rangi
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0d1f14",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7a72",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: 65,
    height: 75,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#d4e6d9",
    justifyContent: "center",
    alignItems: "center",
    // Soyalar (Shadows)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#20d05b",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
    // Fokus bo'lganda kuchliroq soya
    shadowOpacity: 0.1,
    elevation: 5,
  },
  inputFilled: {
    backgroundColor: "#f0fff4",
    borderColor: "#20d05b",
  },
  input: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
    color: "#0d1f14",
  },
});

export default PinCode;
