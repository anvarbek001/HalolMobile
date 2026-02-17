// app/profile.tsx
import { router } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
  redLight: "#fef2f2",
};

const MENU_ITEMS = [
  {
    icon: "lock-outline",
    label: "Parol o'zgartirish",
    danger: false,
    onPress: () => {},
  },
  {
    icon: "logout",
    label: "Chiqish",
    danger: true,
    onPress: () =>
      Alert.alert("Chiqish", "Hisobdan chiqishni tasdiqlaysizmi?", [
        { text: "Bekor qilish", style: "cancel" },
        {
          text: "Chiqish",
          style: "destructive",
          onPress: () => router.replace("/"),
        },
      ]),
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={C.dark} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Profil</Text>
        {/* O'ng tomoni balanslash uchun bo'sh view */}
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
      >
        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/images/halol_icon.jpg")}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.avatarEditBtn}>
              <MaterialIcons name="camera-alt" size={15} color={C.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Abdulloh Karimov</Text>
          <Text style={styles.userEmail}>abdulloh@gmail.com</Text>
        </View>

        {/* ── Statistika ── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>24</Text>
            <Text style={styles.statLabel}>Skanerlangan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: C.green }]}>18</Text>
            <Text style={styles.statLabel}>Halol</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: C.red }]}>6</Text>
            <Text style={styles.statLabel}>Nomalum</Text>
          </View>
        </View>

        {/* ── Menu ── */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconWrap,
                  item.danger && styles.menuIconWrapDanger,
                ]}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={20}
                  color={item.danger ? C.red : C.green}
                />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}
              >
                {item.label}
              </Text>
              {!item.danger && (
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={C.grayLight}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: C.dark,
  },

  // Avatar
  avatarSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: C.green,
  },
  avatarEditBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: C.dark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: C.gray,
  },

  // Stats
  statsCard: {
    flexDirection: "row",
    backgroundColor: C.white,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: 22,
    fontWeight: "800",
    color: C.dark,
  },
  statLabel: {
    fontSize: 12,
    color: C.gray,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    backgroundColor: C.border,
    marginVertical: 4,
  },

  // Menu
  menuCard: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconWrapDanger: {
    backgroundColor: C.redLight,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.dark,
  },
  menuLabelDanger: {
    color: C.red,
  },
});
