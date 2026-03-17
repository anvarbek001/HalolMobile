// app/register.tsx
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
  bg: "#f4faf6",
  white: "#ffffff",
  dark: "#0d1f14",
  gray: "#6b7a72",
  grayLight: "#e8eeea",
  border: "#d4e6d9",
  red: "#ef4444",
};

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    password_confirmation?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Ism kiritilmadi";
    if (!email) e.email = "Email kiritilmadi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Email noto'g'ri";
    if (!password) e.password = "Parol kiritilmadi";
    else if (password.length < 6) e.password = "Parol kamida 6 ta belgi";
    if (!passwordConfirm) e.password_confirmation = "Parolni tasdiqlang";
    else if (password !== passwordConfirm)
      e.password_confirmation = "Parollar mos emas";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          console.log(data);
          setErrors({
            name: data.errors.name?.[0],
            email: data.errors.email?.[0],
            phone: data.errors.phone?.[0],
            password: data.errors.password?.[0],
            password_confirmation: data.errors.password_confirmation?.[0],
          });
          Toast.show({
            type: "error",
            text1: "Xatolik",
            text2: data.message,
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
    } catch (e) {
      console.log("Xatolik xabari:", e);
      Alert.alert("Xatolik", "Internet bilan bog'liq muammo");
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

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
          <Text style={styles.appSubtitle}>Yangi hisob yarating</Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.formCard}>
          {/* Ism */}
          <Field
            label="Ism"
            icon="person-outline"
            placeholder="Ismingiz"
            value={name}
            onChangeText={(t) => {
              setName(t);
              clearError("name");
            }}
            error={errors.name}
          />

          {/* Email */}
          <Field
            label="Email"
            icon="email"
            placeholder="email@gmail.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError("email");
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Telefon */}
          <Field
            label="Telefon (ixtiyoriy)"
            icon="phone"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              clearError("phone");
            }}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          {/* Parol */}
          <Field
            label="Parol"
            icon="lock-outline"
            placeholder="Kamida 6 ta belgi"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clearError("password");
            }}
            error={errors.password}
            secureTextEntry={!showPassword}
            showToggle
            onToggle={() => setShowPassword((v) => !v)}
            isVisible={showPassword}
          />

          {/* Parol tasdiqlash */}
          <Field
            label="Parolni tasdiqlash"
            icon="lock-outline"
            placeholder="Parolni qayta kiriting"
            value={passwordConfirm}
            onChangeText={(t) => {
              setPasswordConfirm(t);
              clearError("password_confirmation");
            }}
            error={errors.password_confirmation}
            secureTextEntry={!showPasswordConfirm}
            showToggle
            onToggle={() => setShowPasswordConfirm((v) => !v)}
            isVisible={showPasswordConfirm}
          />

          {/* Ro'yxatdan o'tish tugmasi */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.white} />
            ) : (
              <Text style={styles.submitBtnText}>Ro'yxatdan o'tish</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Login link ── */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Hisobingiz bormi? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}>Kirish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Qayta ishlatiladigan Field komponenti ──
type FieldProps = {
  label: string;
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  isVisible?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
};

function Field({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  showToggle,
  onToggle,
  isVisible,
  keyboardType,
  autoCapitalize,
}: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        <MaterialIcons
          name={icon}
          size={18}
          color={error ? C.red : C.gray}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={C.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "words"}
          autoCorrect={false}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <MaterialIcons
              name={isVisible ? "visibility" : "visibility-off"}
              size={18}
              color={C.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 28,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: C.green,
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: C.dark,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: C.gray,
  },
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
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: C.dark,
    marginBottom: 7,
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
  submitBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: C.gray,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: C.green,
  },
});
