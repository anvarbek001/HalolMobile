// app/login.tsx
import { API_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const C = {
  green: "#20d05b",
  greenDark: "#17a348",
  greenLight: "#e6f9ee",
  greenMid: "#a8edca",
  bg: "#f4faf6",
  white: "#ffffff",
  dark: "#0d1f14",
  gray: "#6b7a72",
  grayLight: "#e8eeea",
  border: "#d4e6d9",
  red: "#ef4444",
};

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email kiritilmadi";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email noto'g'ri";
    if (!password) newErrors.password = "Parol kiritilmadi";
    else if (password.length < 6)
      newErrors.password = "Parol kamida 6 ta belgi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors({
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Xatolik",
            text2: data.message,
          });
        }
        return;
      }
      Toast.show({
        type: "success",
        text1: "Muvaffaqiyatli",
        text2: data.message,
      });
      console.log(data);
      await login(data.token, data.customer);
      router.replace("/pincode");
    } catch (e: any) {
      Alert.alert("Xatolik", e.message);
      console.log("Xatolik", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.root, { paddingTop: insets.top }]}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Logo ── */}
        <View style={styles.logoSection}>
          <Image
            source={require("../assets/images/halol_icon.jpg")}
            style={styles.logo}
          />
          <Text style={styles.appName}>Halol Scanner</Text>
          <Text style={styles.appSubtitle}>Hisobingizga kiring</Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.formCard}>
          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.inputWrap,
                errors.email ? styles.inputWrapError : null,
              ]}
            >
              <MaterialIcons
                name="email"
                size={18}
                color={errors.email ? C.red : C.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="email@gmail.com"
                placeholderTextColor={C.gray}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email)
                    setErrors((e) => ({ ...e, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          {/* Parol */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Parol</Text>
            <View
              style={[
                styles.inputWrap,
                errors.password ? styles.inputWrapError : null,
              ]}
            >
              <MaterialIcons
                name="lock-outline"
                size={18}
                color={errors.password ? C.red : C.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Parolingiz"
                placeholderTextColor={C.gray}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: undefined }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={18}
                  color={C.gray}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Login tugmasi */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.white} />
            ) : (
              <Text style={styles.loginBtnText}>Kirish</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Register link ── */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Hisob yo'qmi? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>Ro'yxatdan o'tish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Logo
  logoSection: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 36,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: C.green,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: C.dark,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: C.gray,
  },

  // Form
  formCard: {
    backgroundColor: C.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: C.dark,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 12,
    height: 50,
  },
  inputWrapError: {
    borderColor: C.red,
    backgroundColor: "#fff5f5",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.dark,
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: C.red,
    marginTop: 5,
    marginLeft: 4,
  },

  // Login tugmasi
  loginBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
  },

  // Register
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingBottom: 32,
  },
  registerText: {
    fontSize: 14,
    color: C.gray,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: C.green,
  },
});
